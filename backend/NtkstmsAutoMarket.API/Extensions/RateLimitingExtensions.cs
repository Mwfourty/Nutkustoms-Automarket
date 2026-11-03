using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace NtkstmsAutoMarket.API.Extensions;

public static class RateLimitingExtensions
{
    public static IServiceCollection AddRateLimitingPolicies(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // Global per-IP limit
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
                RateLimitPartition.GetFixedWindowLimiter(
                    ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 100,
                        Window = TimeSpan.FromMinutes(1)
                    }));

            // Stricter named policy, e.g. for login or messaging
            options.AddFixedWindowLimiter("strict", o =>
            {
                o.PermitLimit = 5;
                o.Window = TimeSpan.FromMinutes(1);
            });
        });

        return services;
    }
}