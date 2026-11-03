namespace NtkstmsAutoMarket.Application.Features.Messaging.GetConversations;

public record GetConversationsQuery(
    int Page = 1,
    int PageSize = 20
);
