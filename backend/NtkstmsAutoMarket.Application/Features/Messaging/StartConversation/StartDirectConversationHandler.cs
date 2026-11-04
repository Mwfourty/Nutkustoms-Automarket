using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Messaging.StartConversation;

public record StartDirectConversationResult(
    Guid ConversationId,
    bool Created);

// Opens (or returns the existing) listing-less conversation with a user,
// e.g. from the "Message owner" button on a garage car.
public class StartDirectConversationHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public StartDirectConversationHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<StartDirectConversationResult> Handle(
        Guid otherUserId,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        if (otherUserId == currentUserId)
        {
            throw new InvalidOperationException(
                "You cannot start a conversation with yourself.");
        }

        var otherUser = await _context.Users
            .AsNoTracking()
            .Where(x => x.Id == otherUserId)
            .Select(x => new { x.AllowMessages })
            .FirstOrDefaultAsync(cancellationToken);

        if (otherUser is null)
        {
            throw new KeyNotFoundException("User does not exist.");
        }

        var existing = await _context.MarketplaceConversations
            .AsNoTracking()
            .Where(x =>
                x.ListingId == null &&
                ((x.BuyerId == currentUserId && x.SellerId == otherUserId) ||
                 (x.BuyerId == otherUserId && x.SellerId == currentUserId)))
            .Select(x => (Guid?)x.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (existing is not null)
        {
            return new StartDirectConversationResult(existing.Value, false);
        }

        if (!otherUser.AllowMessages)
        {
            throw new InvalidOperationException(
                "This user is not accepting new messages.");
        }

        var conversation = new MarketplaceConversation(
            null,
            currentUserId,
            otherUserId);

        _context.MarketplaceConversations.Add(conversation);

        await _context.SaveChangesAsync(cancellationToken);

        return new StartDirectConversationResult(conversation.Id, true);
    }
}
