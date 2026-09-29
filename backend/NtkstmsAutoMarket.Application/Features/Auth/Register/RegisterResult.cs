namespace NtkstmsAutoMarket.Application.Features.Auth.Register;

public record RegisterResult(
	Guid UserId,
	string Username,
	string Email);