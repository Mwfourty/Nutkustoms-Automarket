using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Messaging.SendMessage;

public class SendMessageHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public SendMessageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<SendMessageResponse?> Handle(
        SendMessageCommand command,
        CancellationToken cancellationToken = default)
    {
        var senderId = _currentUser.UserId;

        if (command.Body is { Length: > 2000 })
            throw new ArgumentException("Messages must be 2000 characters or fewer.");

        // Find the conversation and verify the sender is a participant.
        var conversation = await _context.MarketplaceConversations
            .FirstOrDefaultAsync(conversation =>
                conversation.Id == command.ConversationId &&
                (
                    conversation.BuyerId == senderId ||
                    conversation.SellerId == senderId
                ),
                cancellationToken);

        if (conversation == null)
        {
            return null;
        }

        // Create the message using the domain constructor.
        var message = new MarketplaceMessage(
            conversation.Id,
            senderId,
            command.Body
        );

        // Update the conversation's latest activity timestamp.
        conversation.MarkMessageSent();

        _context.MarketplaceMessages.Add(message);

        await _context.SaveChangesAsync(cancellationToken);

        return new SendMessageResponse
        {
            Id = message.Id,
            ConversationId = message.ConversationId,
            SenderId = message.SenderId,
            Body = message.Body,
            CreatedAt = message.CreatedAt,
            ReadAt = message.ReadAt
        };
    }
}