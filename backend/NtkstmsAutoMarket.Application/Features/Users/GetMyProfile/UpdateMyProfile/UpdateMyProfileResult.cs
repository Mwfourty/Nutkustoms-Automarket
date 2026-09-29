namespace NtkstmsAutoMarket.Application.Features.Users.UpdateMyProfile;

public record UpdateMyProfileResult(
    Guid UserId,
    string FirstName,
    string LastName,
    string? PhoneNumber);