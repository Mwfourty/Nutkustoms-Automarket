using NtkstmsAutoMarket.Domain.Common;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Domain.Entities;

public class Engine : BaseEntity
{
    public Guid ListingId { get; private set; }

    public string Manufacturer { get; private set; } = string.Empty;

    public string Model { get; private set; } = string.Empty;

    public string? EngineCode { get; private set; }

    public decimal? Displacement { get; private set; }

    public int? Kilowatts { get; private set; }

    public FuelType FuelType { get; private set; }

    public int? Mileage { get; private set; }

    public string? CompatibleMake { get; private set; }

    public string? CompatibleModel { get; private set; }

    public int? CompatibleYearFrom { get; private set; }

    public int? CompatibleYearTo { get; private set; }

    public Listing Listing { get; private set; } = null!;

    private Engine()
    {
    }

    public Engine(
        Guid listingId,
        string manufacturer,
        string model,
        string? engineCode,
        decimal? displacement,
        int? kilowatts,
        FuelType fuelType,
        int? mileage,
        string? compatibleMake,
        string? compatibleModel,
        int? compatibleYearFrom,
        int? compatibleYearTo)
    {
        ListingId = listingId;
        Manufacturer = manufacturer;
        Model = model;
        EngineCode = engineCode;
        Displacement = displacement;
        Kilowatts = kilowatts;
        FuelType = fuelType;
        Mileage = mileage;
        CompatibleMake = compatibleMake;
        CompatibleModel = compatibleModel;
        CompatibleYearFrom = compatibleYearFrom;
        CompatibleYearTo = compatibleYearTo;
    }

    public void UpdateDetails(
        string manufacturer,
        string model,
        string? engineCode,
        decimal? displacement,
        int? kilowatts,
        FuelType fuelType,
        int? mileage,
        string? compatibleMake,
        string? compatibleModel,
        int? compatibleYearFrom,
        int? compatibleYearTo)
    {
        Manufacturer = manufacturer;
        Model = model;
        EngineCode = engineCode;
        Displacement = displacement;
        Kilowatts = kilowatts;
        FuelType = fuelType;
        Mileage = mileage;
        CompatibleMake = compatibleMake;
        CompatibleModel = compatibleModel;
        CompatibleYearFrom = compatibleYearFrom;
        CompatibleYearTo = compatibleYearTo;

        MarkAsUpdated();
    }
}