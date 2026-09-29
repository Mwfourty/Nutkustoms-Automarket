using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Auth.Login;

public record LoginResult(
    Guid UserId,
    string Username,
    string Email,
    UserRole Role,
    string Token);
