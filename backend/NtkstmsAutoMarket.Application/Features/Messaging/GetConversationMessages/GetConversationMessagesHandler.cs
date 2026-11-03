using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Messaging.GetConversationMessages;

public class GetConversationMessagesHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetConversationMessagesHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<ConversationMessagesPageResponse?> Handle(
        GetConversationMessagesQuery query,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        // Verify that the current user belongs to this conversation.
        var isParticipant = await _context.MarketplaceConversations
            .AsNoTracking()
            .AnyAsync(conversation =>
                conversation.Id == query.ConversationId &&
                (
                    conversation.BuyerId == currentUserId ||
                    conversation.SellerId == currentUserId
                ),
                cancellationToken);

        if (!isParticipant)
        {
            return null;
        }

        // Base query for this conversation's messages.
        var messagesQuery = _context.MarketplaceMessages
            .AsNoTracking()
            .Where(message =>
                message.ConversationId == query.ConversationId);

        // Get the total number of messages.
        var totalCount = await messagesQuery.CountAsync(
            cancellationToken);

        // Calculate pagination metadata.
        var totalPages = (int)Math.Ceiling(
            (double)totalCount / query.PageSize);

        // Calculate how many messages to skip.
        var skip = (int)Math.Min(
            ((long)query.Page - 1) * query.PageSize,
            int.MaxValue);

        // Fetch the most recent messages for this page.
        var messages = await messagesQuery
            .OrderByDescending(message => message.CreatedAt)
            .ThenByDescending(message => message.Id)
            .Skip(skip)
            .Take(query.PageSize)
            .Select(message => new ConversationMessageResponse
            {
                Id = message.Id,
                SenderId = message.SenderId,
                Body = message.Body,
                CreatedAt = message.CreatedAt,
                ReadAt = message.ReadAt
            })
            .ToListAsync(cancellationToken);

        // Reverse so messages appear oldest to newest.
        messages.Reverse();

        return new ConversationMessagesPageResponse
        {
            Messages = messages,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasNextPage = query.Page < totalPages,
            HasPreviousPage = query.Page > 1
        };
    }
}