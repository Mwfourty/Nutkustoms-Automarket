namespace NtkstmsAutoMarket.Application.Features.Users.UpdateMyProfile;

public record UpdateMyProfileResult(
    Guid UserId,
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string Username,
    string? City,
    string? Province);