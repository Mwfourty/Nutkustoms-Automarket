using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Users.Account;

public record ChangePasswordCommand(
    string CurrentPassword,
    string NewPassword);

public record UpdatePrivacyCommand(
    ProfileVisibility ProfileVisibility,
    bool AllowMessages);

public record DeactivateAccountCommand(
    string Password);

public class AccountHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public AccountHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task ChangePassword(
        ChangePasswordCommand command,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(command.NewPassword) ||
            command.NewPassword.Length < 8)
        {
            throw new ArgumentException(
                "New password must be at least 8 characters long.");
        }

        if (command.NewPassword == command.CurrentPassword)
        {
            throw new ArgumentException(
                "New password must be different from the current password.");
        }

        var user = await GetUser(cancellationToken);

        EnsurePassword(user.PasswordHash, command.CurrentPassword);

        // PasswordChangedAt makes every token issued before this moment invalid.
        user.ChangePassword(
            BCrypt.Net.BCrypt.HashPassword(command.NewPassword));

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdatePrivacy(
        UpdatePrivacyCommand command,
        CancellationToken cancellationToken = default)
    {
        if (!Enum.IsDefined(command.ProfileVisibility))
            throw new ArgumentException("Invalid profile visibility.");

        var user = await GetUser(cancellationToken);

        user.UpdatePrivacy(
            command.ProfileVisibility,
            command.AllowMessages);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task Deactivate(
        DeactivateAccountCommand command,
        CancellationToken cancellationToken = default)
    {
        var user = await GetUser(cancellationToken);

        EnsurePassword(user.PasswordHash, command.Password);

        user.DeactivateByUser();

        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<User> GetUser(
        CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId;

        return await _context.Users
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken)
            ?? throw new KeyNotFoundException("User does not exist.");
    }

    // ArgumentException keeps a wrong password a 400; a 401 would look like an expired session to the client.
    private static void EnsurePassword(string hash, string? password)
    {
        if (string.IsNullOrEmpty(password) ||
            !BCrypt.Net.BCrypt.Verify(password, hash))
        {
            throw new ArgumentException("Password is incorrect.");
        }
    }
}
