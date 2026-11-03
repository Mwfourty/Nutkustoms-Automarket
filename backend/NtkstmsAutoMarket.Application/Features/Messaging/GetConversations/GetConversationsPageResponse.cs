namespace NtkstmsAutoMarket.Application.Features.Messaging.GetConversations;

public sealed class GetConversationsPageResponse
{
    public List<GetConversationItemResponse> Conversations { get; init; } = [];

    public int Page { get; init; }

    public int PageSize { get; init; }

    public int TotalCount { get; init; }

    public int TotalPages { get; init; }

    public bool HasNextPage { get; init; }

    public bool HasPreviousPage { get; init; }
}