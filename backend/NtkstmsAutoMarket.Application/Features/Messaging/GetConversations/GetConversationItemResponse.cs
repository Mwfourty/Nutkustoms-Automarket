using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Messaging.GetConversations;

public class GetConversationItemResponse
{
    public Guid ConversationId { get; set; }

    public DateTime LastMessageAt { get; set; }

    public ConversationParticipantResponse OtherParticipant { get; set; }
        = null!;

    public ConversationListingResponse Listing { get; set; }
        = null!;

    public ConversationLatestMessageResponse? LatestMessage { get; set; }

    public int UnreadCount { get; set; }
}

public class ConversationParticipantResponse
{
    public Guid Id { get; set; }

    public string Username { get; set; } = string.Empty;

    public string? ProfileImageUrl { get; set; }
}

public class ConversationListingResponse
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public ListingStatus Status { get; set; }

    public string? PrimaryImageUrl { get; set; }
}

public class ConversationLatestMessageResponse
{
    public Guid Id { get; set; }

    public Guid SenderId { get; set; }

    public string Body { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? ReadAt { get; set; }
}
