namespace NtkstmsAutoMarket.Application.Features.Users.UpdateProfileImage;

public record UpdateProfileImageResult(
    Guid UserId,
    string ProfileImageUrl);
