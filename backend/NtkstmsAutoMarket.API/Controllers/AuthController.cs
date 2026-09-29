using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NtkstmsAutoMarket.Application.Features.Auth.Login;
using NtkstmsAutoMarket.Application.Features.Auth.Register;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly RegisterHandler _registerHandler;
    private readonly LoginHandler _loginHandler;

    public AuthController(
        RegisterHandler registerHandler,
        LoginHandler loginHandler)
    {
        _registerHandler = registerHandler;
        _loginHandler = loginHandler;
    }

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

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _loginHandler.Handle(
            command,
            cancellationToken);

        return Ok(result);
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