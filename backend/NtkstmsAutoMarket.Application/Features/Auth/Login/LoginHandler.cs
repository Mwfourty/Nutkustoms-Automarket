using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Auth.Login;

public class LoginHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly LoginAttemptTracker _attempts;

    // Verified when the email is unknown so response time does not reveal which accounts exist.
    private static readonly string DummyHash =
        BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString());

    public LoginHandler(
        IApplicationDbContext context,
        ITokenService tokenService,
        LoginAttemptTracker attempts)
    {
        _context = context;
        _tokenService = tokenService;
        _attempts = attempts;
    }

    public async Task<LoginResult> Handle(
        LoginCommand command,
        CancellationToken cancellationToken = default)
    {
        var email = (command.Email ?? string.Empty).Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(command.Password))
        {
            throw new ArgumentException(
                "Email and password are required.");
        }

        // BCrypt only reads 72 bytes; refusing longer input also stops oversized hashing work.
        if (email.Length > 256 || command.Password.Length > 128)
            throw new UnauthorizedAccessException(
                "Invalid email or password.");

        if (_attempts.IsLockedOut(email))
            throw new UnauthorizedAccessException(
                "Too many failed sign-in attempts. Please try again in 15 minutes.");

        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.Email == email,
                cancellationToken);

        var passwordIsValid = BCrypt.Net.BCrypt.Verify(
            command.Password,
            user?.PasswordHash ?? DummyHash);

        if (user is null || !passwordIsValid)
        {
            _attempts.RecordFailure(email);

            throw new UnauthorizedAccessException(
                "Invalid email or password.");
        }

        _attempts.Reset(email);
        if (!user.IsActive)
        {
            if (!user.DeactivatedByUser)
                throw new UnauthorizedAccessException(
                    "This account is inactive.");

            // Logging back in is how a self-deactivated account is restored.
            user.Reactivate();

            await _context.SaveChangesAsync(cancellationToken);
        }

        var token = _tokenService.GenerateToken(user);

        return new LoginResult(
            user.Id,
            user.Username,
            user.Email,
            user.Role,
            token);
    }
}
