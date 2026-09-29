namespace NtkstmsAutoMarket.Application.Features.Messaging.StartConversation;

public record StartConversationCommand(
    Guid ListingId,
    string Message);
