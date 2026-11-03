namespace NtkstmsAutoMarket.Application.Features.Messaging.GetConversationMessages;

public sealed record GetConversationMessagesQuery(
    Guid ConversationId,
    int Page = 1,
    int PageSize = 50
    );