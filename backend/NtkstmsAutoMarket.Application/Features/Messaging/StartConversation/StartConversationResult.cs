namespace NtkstmsAutoMarket.Application.Features.Messaging.StartConversation;

public record StartConversationResult(
    Guid ConversationId,
    Guid MessageId,
    Guid ListingId,
    Guid BuyerId,
    Guid SellerId,
    string Message,
    DateTime CreatedAt);
