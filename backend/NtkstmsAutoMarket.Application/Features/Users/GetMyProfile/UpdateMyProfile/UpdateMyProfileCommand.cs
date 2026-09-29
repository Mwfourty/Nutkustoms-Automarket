namespace NtkstmsAutoMarket.Application.Features.Users.UpdateMyProfile;

public record UpdateMyProfileCommand(
    string FirstName,
    string LastName,
    string? PhoneNumber);