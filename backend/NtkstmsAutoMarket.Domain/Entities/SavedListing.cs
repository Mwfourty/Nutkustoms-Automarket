using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class SavedListing : BaseEntity
{
    public Guid UserId { get; private set; }

    public Guid ListingId { get; private set; }

    public User User { get; private set; } = null!;

    public Listing Listing { get; private set; } = null!;

    private SavedListing()
    {
    }

    public SavedListing(
        Guid userId,
        Guid listingId)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException(
                "User is required.");

        if (listingId == Guid.Empty)
            throw new ArgumentException(
                "Listing is required.");

        UserId = userId;
        ListingId = listingId;
    }
}
