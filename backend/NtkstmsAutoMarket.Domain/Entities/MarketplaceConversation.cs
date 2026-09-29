using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class MarketplaceConversation : BaseEntity
{
    public Guid ListingId { get; private set; }

    public Guid BuyerId { get; private set; }

    public Guid SellerId { get; private set; }

    public DateTime LastMessageAt { get; private set; }

    public Listing Listing { get; private set; } = null!;

    public User Buyer { get; private set; } = null!;

    public User Seller { get; private set; } = null!;

    private MarketplaceConversation()
    {
    }

    public MarketplaceConversation(
        Guid listingId,
        Guid buyerId,
        Guid sellerId)
    {
        if (listingId == Guid.Empty)
            throw new ArgumentException("Listing is required.");

        if (buyerId == Guid.Empty)
            throw new ArgumentException("Buyer is required.");

        if (sellerId == Guid.Empty)
            throw new ArgumentException("Seller is required.");

        if (buyerId == sellerId)
            throw new InvalidOperationException(
                "You cannot start a conversation with yourself.");

        ListingId = listingId;
        BuyerId = buyerId;
        SellerId = sellerId;
        LastMessageAt = DateTime.UtcNow;
    }

    public void MarkMessageSent()
    {
        LastMessageAt = DateTime.UtcNow;
        MarkAsUpdated();
    }
}
