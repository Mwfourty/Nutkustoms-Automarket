using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class Wheel : BaseEntity
{
    public Guid ListingId { get; private set; }

    public string? Brand { get; private set; }

    public string? Model { get; private set; }

    public decimal Diameter { get; private set; }

    public decimal Width { get; private set; }

    public int? Offset { get; private set; }

    public string? BoltPattern { get; private set; }

    public string? Material { get; private set; }

    public string? Colour { get; private set; }

    public string? CompatibleMake { get; private set; }

    public string? CompatibleModel { get; private set; }

    public int? CompatibleYearFrom { get; private set; }

    public int? CompatibleYearTo { get; private set; }

    public int Quantity { get; private set; }

    public Listing Listing { get; private set; } = null!;

    private Wheel()
    {
    }

    public Wheel(
        Guid listingId,
        string? brand,
        string? model,
        decimal diameter,
        decimal width,
        int? offset,
        string? boltPattern,
        string? material,
        string? colour,
        string? compatibleMake,
        string? compatibleModel,
        int? compatibleYearFrom,
        int? compatibleYearTo,
        int quantity)
    {
        ListingId = listingId;
        Brand = brand;
        Model = model;
        Diameter = diameter;
        Width = width;
        Offset = offset;
        BoltPattern = boltPattern;
        Material = material;
        Colour = colour;
        CompatibleMake = compatibleMake;
        CompatibleModel = compatibleModel;
        CompatibleYearFrom = compatibleYearFrom;
        CompatibleYearTo = compatibleYearTo;
        Quantity = quantity;
    }

    public void UpdateDetails(
        string? brand,
        string? model,
        decimal diameter,
        decimal width,
        int? offset,
        string? boltPattern,
        string? material,
        string? colour,
        string? compatibleMake,
        string? compatibleModel,
        int? compatibleYearFrom,
        int? compatibleYearTo,
        int quantity)
    {
        Brand = brand;
        Model = model;
        Diameter = diameter;
        Width = width;
        Offset = offset;
        BoltPattern = boltPattern;
        Material = material;
        Colour = colour;
        CompatibleMake = compatibleMake;
        CompatibleModel = compatibleModel;
        CompatibleYearFrom = compatibleYearFrom;
        CompatibleYearTo = compatibleYearTo;
        Quantity = quantity;

        MarkAsUpdated();
    }
}