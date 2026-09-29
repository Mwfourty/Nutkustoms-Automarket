using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class Part : BaseEntity
{
    public Guid ListingId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public string? PartNumber { get; private set; }

    public string? Description { get; private set; }

    public string? Manufacturer { get; private set; }

    public string? CompatibleMake { get; private set; }

    public string? CompatibleModel { get; private set; }

    public int? CompatibleYearFrom { get; private set; }

    public int? CompatibleYearTo { get; private set; }

    public string? Condition { get; private set; }

    public Listing Listing { get; private set; } = null!;

    private Part()
    {
    }

    public Part(
        Guid listingId,
        string name,
        string? partNumber,
        string? description,
        string? manufacturer,
        string? compatibleMake,
        string? compatibleModel,
        int? compatibleYearFrom,
        int? compatibleYearTo,
        string? condition)
    {
        ListingId = listingId;
        Name = name;
        PartNumber = partNumber;
        Description = description;
        Manufacturer = manufacturer;
        CompatibleMake = compatibleMake;
        CompatibleModel = compatibleModel;
        CompatibleYearFrom = compatibleYearFrom;
        CompatibleYearTo = compatibleYearTo;
        Condition = condition;
    }

    public void UpdateDetails(
        string name,
        string? partNumber,
        string? description,
        string? manufacturer,
        string? compatibleMake,
        string? compatibleModel,
        int? compatibleYearFrom,
        int? compatibleYearTo,
        string? condition)
    {
        Name = name;
        PartNumber = partNumber;
        Description = description;
        Manufacturer = manufacturer;
        CompatibleMake = compatibleMake;
        CompatibleModel = compatibleModel;
        CompatibleYearFrom = compatibleYearFrom;
        CompatibleYearTo = compatibleYearTo;
        Condition = condition;

        MarkAsUpdated();
    }
}