using NtkstmsAutoMarket.Domain.Common;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Domain.Entities;

public class Listing : BaseEntity
{
    public Guid SellerId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public decimal Price { get; private set; }

    public ListingType Type { get; private set; }

    public ListingCondition Condition { get; private set; }

    public ListingStatus Status { get; private set; }

    public string? Location { get; private set; }

    public Guid? SourceGarageVehicleId { get; private set; }

    public GarageVehicle? SourceGarageVehicle { get; private set; }

    public User Seller { get; private set; } = null!;

    public Vehicle? Vehicle { get; private set; }

    public Part? Part { get; private set; }

    public Engine? Engine { get; private set; }

    public Wheel? Wheel { get; private set; }

    private Listing()
    {
    }

    public Listing(
        Guid sellerId,
        string title,
        string description,
        decimal price,
        ListingType type,
        ListingCondition condition,
        string? location)
    {
        SellerId = sellerId;
        Title = title;
        Description = description;
        Price = price;
        Type = type;
        Condition = condition;
        Location = location;

        Status = ListingStatus.Draft;
    }

    public ICollection<ListingImage> Images { get; private set; }
    = new List<ListingImage>();

    public ICollection<ListingDocument> Documents { get; private set; }
    = new List<ListingDocument>();

    public void Publish()
    {
        if (Status != ListingStatus.Draft)
            throw new InvalidOperationException(
                "Only draft listings can be published.");

        Status = ListingStatus.Active;
        MarkAsUpdated();
    }

    public void SetSourceGarageVehicle(Guid garageVehicleId)
    {
        if (garageVehicleId == Guid.Empty)
        {
            throw new ArgumentException(
                "Garage vehicle ID is required.");
        }

        SourceGarageVehicleId = garageVehicleId;

        MarkAsUpdated();
    }

    public void Reserve()
    {
        if (Status != ListingStatus.Active)
            throw new InvalidOperationException(
                "Only active listings can be reserved.");

        Status = ListingStatus.Reserved;
        MarkAsUpdated();
    }

    public void MarkAsSold()
    {
        if (Status != ListingStatus.Active &&
            Status != ListingStatus.Reserved)
        {
            throw new InvalidOperationException(
                "Only active or reserved listings can be marked as sold.");
        }

        Status = ListingStatus.Sold;
        MarkAsUpdated();
    }

    public void Remove()
    {
        if (Status == ListingStatus.Sold)
            throw new InvalidOperationException(
                "Sold listings cannot be removed.");

        if (Status == ListingStatus.Removed)
            throw new InvalidOperationException(
                "Listing has already been removed.");

        Status = ListingStatus.Removed;
        MarkAsUpdated();
    }

    public void UpdateDetails(
    string title,
    string description,
    decimal price,
    ListingCondition condition,
    string? location)
    {
        if (Status == ListingStatus.Sold)
            throw new InvalidOperationException(
                "Sold listings cannot be edited.");

        if (Status == ListingStatus.Removed)
            throw new InvalidOperationException(
                "Removed listings cannot be edited.");

        Title = title;
        Description = description;
        Price = price;
        Condition = condition;
        Location = location;

        MarkAsUpdated();
    }
}