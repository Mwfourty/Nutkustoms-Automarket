using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Messaging.GetConversations;

public class GetConversationsHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetConversationsHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetConversationsPageResponse> Handle(
        GetConversationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        // Get conversations belonging to the current user.
        var conversationsQuery =
            _context.MarketplaceConversations
                .AsNoTracking()
                .Where(conversation =>
                    conversation.BuyerId == currentUserId ||
                    conversation.SellerId == currentUserId);

        // Count all conversations before pagination.
        var totalCount = await conversationsQuery.CountAsync(
            cancellationToken);

        // Calculate pagination information.
        var totalPages = (int)Math.Ceiling(
            (double)totalCount / query.PageSize);

        var skip = (int)Math.Min(
            ((long)query.Page - 1) * query.PageSize,
            int.MaxValue);

        // Retrieve only the conversations for this page.
        var conversations =
            await conversationsQuery
                .OrderByDescending(conversation =>
                    conversation.LastMessageAt)
                .ThenByDescending(conversation =>
                    conversation.Id)
                .Skip(skip)
                .Take(query.PageSize)
                .Select(conversation =>
                    new GetConversationItemResponse
                    {
                        ConversationId = conversation.Id,

                        LastMessageAt =
                            conversation.LastMessageAt,

                        OtherParticipant =
                            conversation.BuyerId == currentUserId
                                ? new ConversationParticipantResponse
                                {
                                    Id = conversation.Seller.Id,
                                    Username =
                                        conversation.Seller.Username,
                                    ProfileImageUrl =
                                        conversation.Seller.ProfileImageUrl
                                }
                                : new ConversationParticipantResponse
                                {
                                    Id = conversation.Buyer.Id,
                                    Username =
                                        conversation.Buyer.Username,
                                    ProfileImageUrl =
                                        conversation.Buyer.ProfileImageUrl
                                },

                        Listing =
                            conversation.Listing == null
                                ? null
                                : new ConversationListingResponse
                                {
                                    Id = conversation.Listing.Id,
                                    Title =
                                        conversation.Listing.Title,
                                    Price =
                                        conversation.Listing.Price,
                                    Status =
                                        conversation.Listing.Status,

                                    PrimaryImageUrl =
                                        _context.ListingImages
                                            .Where(image =>
                                                image.ListingId ==
                                                    conversation.ListingId &&
                                                image.IsPrimary)
                                            .Select(image => image.Url)
                                            .FirstOrDefault()
                                },

                        LatestMessage =
                            _context.MarketplaceMessages
                                .Where(message =>
                                    message.ConversationId ==
                                    conversation.Id)
                                .OrderByDescending(message =>
                                    message.CreatedAt)
                                .ThenByDescending(message =>
                                    message.Id)
                                .Select(message =>
                                    new ConversationLatestMessageResponse
                                    {
                                        Id = message.Id,
                                        SenderId = message.SenderId,
                                        Body = message.Body,
                                        CreatedAt =
                                            message.CreatedAt,
                                        ReadAt = message.ReadAt
                                    })
                                .FirstOrDefault(),

                        UnreadCount =
                            _context.MarketplaceMessages
                                .Count(message =>
                                    message.ConversationId ==
                                        conversation.Id &&
                                    message.SenderId !=
                                        currentUserId &&
                                    message.ReadAt == null)
                    })
                .ToListAsync(cancellationToken);

        return new GetConversationsPageResponse
        {
            Conversations = conversations,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasNextPage = query.Page < totalPages,
            HasPreviousPage = query.Page > 1
        };
    }
}