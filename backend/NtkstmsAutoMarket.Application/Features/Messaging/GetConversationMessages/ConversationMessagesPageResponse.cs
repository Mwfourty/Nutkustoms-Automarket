namespace NtkstmsAutoMarket.Application.Features.Messaging.GetConversationMessages;

public sealed class ConversationMessagesPageResponse
{
    public List<ConversationMessageResponse> Messages { get; init; } = [];

    public int Page { get; init; }

    public int PageSize { get; init; }

    public int TotalCount { get; init; }

    public int TotalPages { get; init; }

    public bool HasNextPage { get; init; }

    public bool HasPreviousPage { get; init; }
}