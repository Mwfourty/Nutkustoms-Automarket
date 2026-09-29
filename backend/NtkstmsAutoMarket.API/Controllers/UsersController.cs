using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NtkstmsAutoMarket.Application.Features.Users.GetMyProfile;
using NtkstmsAutoMarket.Application.Features.Users.GetPublicProfile;
using NtkstmsAutoMarket.Application.Features.Users.UpdateMyProfile;
using NtkstmsAutoMarket.Application.Features.Users.UpdateProfileImage;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly GetMyProfileHandler _getMyProfileHandler;
    private readonly UpdateMyProfileHandler _updateMyProfileHandler;
    private readonly UpdateProfileImageHandler _updateProfileImageHandler;
    private readonly GetPublicProfileHandler _getPublicProfileHandler;

    public UsersController(
        GetMyProfileHandler getMyProfileHandler,
        UpdateMyProfileHandler updateMyProfileHandler,
        UpdateProfileImageHandler updateProfileImageHandler,
        GetPublicProfileHandler getPublicProfileHandler)
    {
        _getMyProfileHandler = getMyProfileHandler;
        _updateMyProfileHandler = updateMyProfileHandler;
        _updateProfileImageHandler = updateProfileImageHandler;
        _getPublicProfileHandler = getPublicProfileHandler;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile(
        CancellationToken cancellationToken)
    {
        var result = await _getMyProfileHandler.Handle(
            new GetMyProfileQuery(),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile(
        UpdateMyProfileCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _updateMyProfileHandler.Handle(
            command,
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("me/profile-image")]
    public async Task<IActionResult> UpdateProfileImage(
        UpdateProfileImageCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _updateProfileImageHandler.Handle(
            command,
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id:guid}/public")]
    public async Task<IActionResult> GetPublicProfile(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _getPublicProfileHandler.Handle(
            new GetPublicProfileQuery(id),
            cancellationToken);

        return Ok(result);
    }
}