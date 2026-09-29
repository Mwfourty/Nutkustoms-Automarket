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

    public async Task<List<GetConversationItemResponse>> Handle(
        GetConversationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        var conversations =
            await _context.MarketplaceConversations
                .AsNoTracking()
                .Where(conversation =>
                    conversation.BuyerId == currentUserId ||
                    conversation.SellerId == currentUserId)
                .OrderByDescending(conversation =>
                    conversation.LastMessageAt)
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
                            new ConversationListingResponse
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

        return conversations;
    }
}
