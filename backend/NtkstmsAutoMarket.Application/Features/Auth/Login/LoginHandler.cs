using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Auth.Login;

public class LoginHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;

    public LoginHandler(
        IApplicationDbContext context,
        ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<LoginResult> Handle(
        LoginCommand command,
        CancellationToken cancellationToken = default)
    {
        var email = command.Email.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(command.Password))
        {
            throw new ArgumentException(
                "Email and password are required.");
        }

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Email == email,
                cancellationToken);

        if (user is null)
            throw new UnauthorizedAccessException(
                "Invalid email or password.");

        var passwordIsValid = BCrypt.Net.BCrypt.Verify(
            command.Password,
            user.PasswordHash);

        if (!passwordIsValid)
            throw new UnauthorizedAccessException(
                "Invalid email or password.");

        if (!user.IsActive)
            throw new UnauthorizedAccessException(
                "This account is inactive.");

        var token = _tokenService.GenerateToken(user);

        return new LoginResult(
            user.Id,
            user.Username,
            user.Email,
            user.Role,
            token);
    }
}
