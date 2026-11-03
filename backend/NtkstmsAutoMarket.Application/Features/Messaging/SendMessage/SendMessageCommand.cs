namespace NtkstmsAutoMarket.Application.Features.Messaging.SendMessage;

public sealed record SendMessageCommand(
    Guid ConversationId,
    string Body
);