using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Auth.Logout;

public record LogoutCommand(
    string Jti,
    DateTime ExpiresAt);

public class LogoutHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public LogoutHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task Handle(
        LogoutCommand command,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;
        var now = DateTime.UtcNow;

        // Entries past their expiry can no longer be replayed, so they are safe to purge.
        var expired = await _context.RevokedTokens
            .Where(x => x.ExpiresAt < now)
            .ToListAsync(cancellationToken);

        _context.RevokedTokens.RemoveRange(expired);

        var alreadyRevoked = await _context.RevokedTokens
            .AnyAsync(
                x => x.Jti == command.Jti,
                cancellationToken);

        if (!alreadyRevoked)
        {
            _context.RevokedTokens.Add(
                new RevokedToken(
                    command.Jti,
                    userId,
                    command.ExpiresAt));
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
