using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class ListingImage : BaseEntity
{
    public Guid ListingId { get; private set; }

    public string Url { get; private set; } = string.Empty;

    public int DisplayOrder { get; private set; }

    public bool IsPrimary { get; private set; }

    public Listing Listing { get; private set; } = null!;

    private ListingImage()
    {
    }

    public ListingImage(
        Guid listingId,
        string url,
        int displayOrder,
        bool isPrimary)
    {
        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException(
                "Image URL cannot be empty.");

        if (displayOrder < 0)
            throw new ArgumentException(
                "Display order cannot be negative.");

        ListingId = listingId;
        Url = url;
        DisplayOrder = displayOrder;
        IsPrimary = isPrimary;
    }

    public void UpdateDisplayOrder(int displayOrder)
    {
        if (displayOrder < 0)
            throw new ArgumentException(
                "Display order cannot be negative.");

        DisplayOrder = displayOrder;

        MarkAsUpdated();
    }

    public void SetAsPrimary()
    {
        IsPrimary = true;

        MarkAsUpdated();
    }

    public void RemoveAsPrimary()
    {
        IsPrimary = false;

        MarkAsUpdated();
    }
}