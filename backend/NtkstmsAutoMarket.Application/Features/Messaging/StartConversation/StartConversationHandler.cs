using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Messaging.StartConversation;

public class StartConversationHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public StartConversationHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<StartConversationResult> Handle(
        StartConversationCommand command,
        CancellationToken cancellationToken = default)
    {
        var buyerId = _currentUser.UserId;

        var listing = await _context.Listings
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == command.ListingId,
                cancellationToken);

        if (listing is null)
        {
            throw new KeyNotFoundException(
                "Listing does not exist.");
        }

        if (listing.Status != ListingStatus.Active)
        {
            throw new InvalidOperationException(
                "You can only start a conversation from an active listing.");
        }

        if (listing.SellerId == buyerId)
        {
            throw new InvalidOperationException(
                "You cannot start a conversation about your own listing.");
        }

        var existingConversation =
            await _context.MarketplaceConversations
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    x =>
                        x.ListingId == listing.Id &&
                        x.BuyerId == buyerId,
                    cancellationToken);

        if (existingConversation is not null)
        {
            throw new InvalidOperationException(
                $"A conversation already exists for this listing. Conversation ID: {existingConversation.Id}");
        }

        var conversation = new MarketplaceConversation(
            listing.Id,
            buyerId,
            listing.SellerId);

        var message = new MarketplaceMessage(
            conversation.Id,
            buyerId,
            command.Message);

        _context.MarketplaceConversations.Add(
            conversation);

        _context.MarketplaceMessages.Add(
            message);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new StartConversationResult(
            conversation.Id,
            message.Id,
            listing.Id,
            buyerId,
            listing.SellerId,
            message.Body,
            message.CreatedAt);
    }
}
