using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Messaging.MarkConversationAsRead;

public class MarkConversationAsReadHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public MarkConversationAsReadHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<int?> Handle(
        MarkConversationAsReadCommand command,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        // Verify that the current user belongs to this conversation.
        var isParticipant = await _context.MarketplaceConversations
            .AnyAsync(conversation =>
                conversation.Id == command.ConversationId &&
                (
                    conversation.BuyerId == currentUserId ||
                    conversation.SellerId == currentUserId
                ),
                cancellationToken);

        if (!isParticipant)
        {
            return null;
        }

        // Retrieve unread messages sent by the other participant.
        var unreadMessages = await _context.MarketplaceMessages
            .Where(message =>
                message.ConversationId == command.ConversationId &&
                message.SenderId != currentUserId &&
                message.ReadAt == null)
            .ToListAsync(cancellationToken);

        if (unreadMessages.Count == 0)
        {
            return 0;
        }

        var readAt = DateTime.UtcNow;

        foreach (var message in unreadMessages)
        {
            message.MarkAsRead(readAt);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return unreadMessages.Count;
    }
}