namespace NtkstmsAutoMarket.Application.Features.Users.UpdateMyProfile;

public record UpdateMyProfileCommand(
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string? Username = null,
    string? City = null,
    string? Province = null);