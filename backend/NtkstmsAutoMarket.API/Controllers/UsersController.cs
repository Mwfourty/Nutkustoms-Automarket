using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NtkstmsAutoMarket.API.Extensions;
using NtkstmsAutoMarket.Application.Features.Users.GetMyProfile;
using NtkstmsAutoMarket.Application.Features.Users.GetPublicProfile;
using NtkstmsAutoMarket.Application.Features.Users.UpdateMyProfile;
using NtkstmsAutoMarket.Application.Features.Users.UpdateProfileImage;
using NtkstmsAutoMarket.Application.Features.Users.SavedListings;
using NtkstmsAutoMarket.Application.Features.Users.SavedContacts;
using NtkstmsAutoMarket.Application.Features.Users.ProfileImage;
using NtkstmsAutoMarket.Application.Features.Users.Account;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly GetMyProfileHandler _getMyProfileHandler;
    private readonly UpdateMyProfileHandler _updateMyProfileHandler;
    private readonly UpdateProfileImageHandler _updateProfileImageHandler;
    private readonly GetPublicProfileHandler _getPublicProfileHandler;
    private readonly SavedListingsHandler _savedListingsHandler;
    private readonly SavedContactsHandler _savedContactsHandler;
    private readonly ProfileImageHandler _profileImageHandler;
    private readonly AccountHandler _accountHandler;
    private readonly IAvatarStorage _avatarStorage;

    public UsersController(
        GetMyProfileHandler getMyProfileHandler,
        UpdateMyProfileHandler updateMyProfileHandler,
        UpdateProfileImageHandler updateProfileImageHandler,
        GetPublicProfileHandler getPublicProfileHandler,
        SavedListingsHandler savedListingsHandler,
        SavedContactsHandler savedContactsHandler,
        ProfileImageHandler profileImageHandler,
        AccountHandler accountHandler,
        IAvatarStorage avatarStorage)
    {
        _profileImageHandler = profileImageHandler;
        _accountHandler = accountHandler;
        _avatarStorage = avatarStorage;
        _getMyProfileHandler = getMyProfileHandler;
        _updateMyProfileHandler = updateMyProfileHandler;
        _updateProfileImageHandler = updateProfileImageHandler;
        _getPublicProfileHandler = getPublicProfileHandler;
        _savedListingsHandler = savedListingsHandler;
        _savedContactsHandler = savedContactsHandler;
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
    [EnableRateLimiting(RateLimitPolicies.Uploads)]
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

    [Authorize]
    [EnableRateLimiting(RateLimitPolicies.Uploads)]
    [HttpPost("me/avatar")]
    [RequestSizeLimit(3 * 1024 * 1024)]
    public async Task<IActionResult> UploadAvatar(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file.Length > ProfileImageHandler.MaxBytes)
            return BadRequest("Image must be 2 MB or smaller.");

        using var buffer = new MemoryStream();
        await file.CopyToAsync(buffer, cancellationToken);

        var url = await _profileImageHandler.Upload(
            buffer.ToArray(),
            cancellationToken);

        return Ok(new { profileImageUrl = url });
    }

    [Authorize]
    [HttpDelete("me/avatar")]
    public async Task<IActionResult> RemoveAvatar(
        CancellationToken cancellationToken)
    {
        await _profileImageHandler.Remove(cancellationToken);

        return NoContent();
    }

    [HttpGet("{id:guid}/avatar")]
    public IActionResult GetAvatar(Guid id)
    {
        var avatar = _avatarStorage.Open(id);

        if (avatar is null)
            return NotFound();

        Response.Headers.CacheControl = "public, max-age=86400";
        Response.Headers.XContentTypeOptions = "nosniff";

        return File(avatar.Content, avatar.ContentType);
    }

    [Authorize]
    [HttpPut("me/privacy")]
    public async Task<IActionResult> UpdatePrivacy(
        UpdatePrivacyCommand command,
        CancellationToken cancellationToken)
    {
        await _accountHandler.UpdatePrivacy(
            command,
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpPost("me/change-password")]
    public async Task<IActionResult> ChangePassword(
        ChangePasswordCommand command,
        CancellationToken cancellationToken)
    {
        await _accountHandler.ChangePassword(
            command,
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpPost("me/deactivate")]
    public async Task<IActionResult> Deactivate(
        DeactivateAccountCommand command,
        CancellationToken cancellationToken)
    {
        await _accountHandler.Deactivate(
            command,
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpGet("me/saved-listings")]
    public async Task<IActionResult> GetSavedListings(
        CancellationToken cancellationToken)
    {
        return Ok(await _savedListingsHandler.GetAll(
            cancellationToken));
    }

    [Authorize]
    [HttpGet("me/saved-listings/ids")]
    public async Task<IActionResult> GetSavedListingIds(
        CancellationToken cancellationToken)
    {
        return Ok(await _savedListingsHandler.GetIds(
            cancellationToken));
    }

    [Authorize]
    [HttpPut("me/saved-listings/{listingId:guid}")]
    public async Task<IActionResult> SaveListing(
        Guid listingId,
        CancellationToken cancellationToken)
    {
        await _savedListingsHandler.Save(
            listingId,
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpDelete("me/saved-listings/{listingId:guid}")]
    public async Task<IActionResult> RemoveSavedListing(
        Guid listingId,
        CancellationToken cancellationToken)
    {
        await _savedListingsHandler.Remove(
            listingId,
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpGet("me/saved-contacts")]
    public async Task<IActionResult> GetSavedContacts(
        CancellationToken cancellationToken)
    {
        return Ok(await _savedContactsHandler.GetAll(
            cancellationToken));
    }

    [Authorize]
    [HttpPut("me/saved-contacts/{contactUserId:guid}")]
    public async Task<IActionResult> AddSavedContact(
        Guid contactUserId,
        CancellationToken cancellationToken)
    {
        await _savedContactsHandler.Add(
            contactUserId,
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpDelete("me/saved-contacts/{contactUserId:guid}")]
    public async Task<IActionResult> RemoveSavedContact(
        Guid contactUserId,
        CancellationToken cancellationToken)
    {
        await _savedContactsHandler.Remove(
            contactUserId,
            cancellationToken);

        return NoContent();
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