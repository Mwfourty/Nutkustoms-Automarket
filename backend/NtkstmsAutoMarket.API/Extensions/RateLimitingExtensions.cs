using System.Security.Claims;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;

namespace NtkstmsAutoMarket.API.Extensions;

public static class RateLimitPolicies
{
    public const string Auth = "auth";
    public const string Uploads = "uploads";
    public const string Messaging = "messaging";
}

public static class RateLimitingExtensions
{
    // Authenticated callers are limited per account, everyone else per IP.
    private static string PartitionKey(HttpContext ctx) =>
        ctx.User.FindFirstValue(ClaimTypes.NameIdentifier) is { } userId
            ? $"user:{userId}"
            : $"ip:{ctx.Connection.RemoteIpAddress}";

    private static RateLimitPartition<string> Window(
        string key, int permits, TimeSpan window) =>
        RateLimitPartition.GetFixedWindowLimiter(
            key,
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = permits,
                Window = window,
                QueueLimit = 0
            });

    public static IServiceCollection AddRateLimitingPolicies(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // Generous: a listing page loads dozens of images.
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
                Window(PartitionKey(ctx), 600, TimeSpan.FromMinutes(1)));

            // Brute-force protection for login and registration, per IP.
            options.AddPolicy(RateLimitPolicies.Auth, ctx =>
                Window($"auth:{ctx.Connection.RemoteIpAddress}", 10, TimeSpan.FromMinutes(1)));

            options.AddPolicy(RateLimitPolicies.Uploads, ctx =>
                Window($"upload:{PartitionKey(ctx)}", 40, TimeSpan.FromMinutes(1)));

            options.AddPolicy(RateLimitPolicies.Messaging, ctx =>
                Window($"msg:{PartitionKey(ctx)}", 30, TimeSpan.FromMinutes(1)));

            options.OnRejected = (context, _) =>
            {
                context.HttpContext.Response.Headers.RetryAfter = "60";
                return ValueTask.CompletedTask;
            };
        });

        return services;
    }
}
