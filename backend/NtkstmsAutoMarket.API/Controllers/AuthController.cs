using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using NtkstmsAutoMarket.API.Extensions;
using NtkstmsAutoMarket.Infrastructure.Authentication;
using NtkstmsAutoMarket.Application.Features.Auth.Login;
using NtkstmsAutoMarket.Application.Features.Auth.Logout;
using NtkstmsAutoMarket.Application.Features.Auth.Register;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly RegisterHandler _registerHandler;
    private readonly LoginHandler _loginHandler;
    private readonly LogoutHandler _logoutHandler;
    private readonly IWebHostEnvironment _environment;
    private readonly JwtSettings _jwtSettings;

    public AuthController(
        RegisterHandler registerHandler,
        LoginHandler loginHandler,
        LogoutHandler logoutHandler,
        IWebHostEnvironment environment,
        IOptions<JwtSettings> jwtSettings)
    {
        _registerHandler = registerHandler;
        _loginHandler = loginHandler;
        _logoutHandler = logoutHandler;
        _environment = environment;
        _jwtSettings = jwtSettings.Value;
    }

    [EnableRateLimiting(RateLimitPolicies.Auth)]
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _registerHandler.Handle(
            command,
            cancellationToken);

        return Created(
            $"/api/users/{result.UserId}",
            result);
    }

    [EnableRateLimiting(RateLimitPolicies.Auth)]
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _loginHandler.Handle(
            command,
            cancellationToken);

        // The token only ever travels in an HttpOnly cookie, never in the response body.
        AuthCookie.Append(
            Response,
            result.Token,
            DateTimeOffset.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
            secure: !_environment.IsDevelopment());

        return Ok(new
        {
            result.UserId,
            result.Username,
            result.Email,
            result.Role
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        CancellationToken cancellationToken)
    {
        AuthCookie.Delete(Response, secure: !_environment.IsDevelopment());

        if (User.Identity?.IsAuthenticated != true)
            return NoContent();

        var jti = User.FindFirstValue(
            JwtRegisteredClaimNames.Jti);

        // Tokens issued before logout support existed carry no jti; the client still clears them.
        if (!string.IsNullOrEmpty(jti))
        {
            var expClaim = User.FindFirstValue(
                JwtRegisteredClaimNames.Exp);

            var expiresAt = long.TryParse(expClaim, out var exp)
                ? DateTimeOffset.FromUnixTimeSeconds(exp).UtcDateTime
                : DateTime.UtcNow.AddHours(24);

            await _logoutHandler.Handle(
                new LogoutCommand(jti, expiresAt),
                cancellationToken);
        }

        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        var username = User.FindFirstValue(
            ClaimTypes.Name);

        var email = User.FindFirstValue(
            ClaimTypes.Email);

        var role = User.FindFirstValue(
            ClaimTypes.Role);

        return Ok(new
        {
            userId,
            username,
            email,
            role
        });
    }
}