using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class MarketplaceMessage : BaseEntity
{
    public Guid ConversationId { get; private set; }

    public Guid SenderId { get; private set; }

    public string Body { get; private set; } = string.Empty;

    public DateTime? ReadAt { get; private set; }

    public MarketplaceConversation Conversation { get; private set; } = null!;

    public User Sender { get; private set; } = null!;

    private MarketplaceMessage()
    {
    }

    public MarketplaceMessage(
        Guid conversationId,
        Guid senderId,
        string body)
    {
        if (conversationId == Guid.Empty)
            throw new ArgumentException(
                "Conversation is required.");

        if (senderId == Guid.Empty)
            throw new ArgumentException(
                "Sender is required.");

        if (string.IsNullOrWhiteSpace(body))
            throw new ArgumentException(
                "Message cannot be empty.");

        if (body.Length > 4000)
            throw new ArgumentException(
                "Message cannot exceed 4000 characters.");

        ConversationId = conversationId;
        SenderId = senderId;
        Body = body.Trim();
    }

    public void MarkAsRead()
    {
        if (ReadAt is not null)
            return;

        ReadAt = DateTime.UtcNow;
        MarkAsUpdated();
    }
}
