namespace NtkstmsAutoMarket.API.Extensions;

/// <summary>The JWT lives in an HttpOnly cookie so injected scripts cannot read it.</summary>
public static class AuthCookie
{
    public const string Name = "ntk_auth";

    public static void Append(
        HttpResponse response,
        string token,
        DateTimeOffset expires,
        bool secure) =>
        response.Cookies.Append(Name, token, Options(expires, secure));

    public static void Delete(HttpResponse response, bool secure) =>
        response.Cookies.Delete(Name, Options(null, secure));

    private static CookieOptions Options(DateTimeOffset? expires, bool secure) => new()
    {
        HttpOnly = true,
        Secure = secure,
        SameSite = SameSiteMode.Strict,
        Path = "/api",
        IsEssential = true,
        Expires = expires
    };
}
