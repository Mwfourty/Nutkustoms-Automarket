namespace NtkstmsAutoMarket.Application.Features.Auth.Register;

public record RegisterCommand(
	string FirstName,
	string LastName,
	string Username,
	string Email,
	string Password);