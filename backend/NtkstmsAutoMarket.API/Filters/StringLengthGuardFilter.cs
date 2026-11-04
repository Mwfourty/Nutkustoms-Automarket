using System.Collections;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace NtkstmsAutoMarket.API.Filters;

/// <summary>
/// Rejects oversized free-text in any request body so unbounded strings never reach the database
/// or the password hasher. Applies to every string property of every action argument.
/// </summary>
public sealed class StringLengthGuardFilter : IActionFilter
{
    private const int MaxLength = 5000;
    private const int MaxDepth = 4;

    public void OnActionExecuting(ActionExecutingContext context)
    {
        foreach (var argument in context.ActionArguments.Values)
        {
            if (Exceeds(argument, 0))
            {
                context.Result = new BadRequestObjectResult(new ProblemDetails
                {
                    Status = StatusCodes.Status400BadRequest,
                    Title = "Bad request",
                    Detail = $"Text fields may not exceed {MaxLength} characters."
                });
                return;
            }
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }

    private static bool Exceeds(object? value, int depth)
    {
        if (value is null || depth > MaxDepth) return false;
        if (value is string s) return s.Length > MaxLength;

        var type = value.GetType();
        if (type.IsPrimitive || type.IsEnum || value is IFormFile || value is Stream) return false;
        if (type.Namespace?.StartsWith("System") == true && value is not IEnumerable) return false;

        if (value is IEnumerable items)
        {
            foreach (var item in items)
                if (Exceeds(item, depth + 1)) return true;
            return false;
        }

        foreach (var property in type.GetProperties())
        {
            if (property.GetIndexParameters().Length > 0 || !property.CanRead) continue;
            if (Exceeds(property.GetValue(value), depth + 1)) return true;
        }

        return false;
    }
}
