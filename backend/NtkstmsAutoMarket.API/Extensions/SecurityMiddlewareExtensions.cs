namespace NtkstmsAutoMarket.API.Extensions;

public static class SecurityMiddlewareExtensions
{
    public const string CsrfHeader = "X-Requested-With";

    /// <summary>
    /// Adds hardening headers to every response. This API only serves JSON and images,
    /// so the CSP can forbid everything.
    /// </summary>
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app) =>
        app.Use(async (context, next) =>
        {
            var headers = context.Response.Headers;
            headers["X-Content-Type-Options"] = "nosniff";
            headers["X-Frame-Options"] = "DENY";
            headers["Referrer-Policy"] = "no-referrer";
            headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()";
            headers["Cross-Origin-Resource-Policy"] = "same-origin";
            headers["Content-Security-Policy"] =
                "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";

            // Authenticated responses must never be cached by shared caches.
            if (context.Request.Path.StartsWithSegments("/api/Auth"))
                headers["Cache-Control"] = "no-store";

            await next();
        });

    /// <summary>
    /// Cookie-authenticated, state-changing requests must carry a custom header. Browsers cannot
    /// add one cross-site without a CORS preflight (which this API never approves), so forged
    /// form posts are rejected even if SameSite were bypassed.
    /// </summary>
    public static IApplicationBuilder UseCsrfProtection(this IApplicationBuilder app) =>
        app.Use(async (context, next) =>
        {
            var method = context.Request.Method;
            var isSafe = HttpMethods.IsGet(method) || HttpMethods.IsHead(method) ||
                         HttpMethods.IsOptions(method) || HttpMethods.IsTrace(method);

            var usesCookie =
                context.Request.Cookies.ContainsKey(AuthCookie.Name) &&
                !context.Request.Headers.ContainsKey("Authorization");

            if (!isSafe && usesCookie && !context.Request.Headers.ContainsKey(CsrfHeader))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsJsonAsync(new
                {
                    title = "Forbidden",
                    detail = "Missing request verification header."
                });
                return;
            }

            await next();
        });
}
