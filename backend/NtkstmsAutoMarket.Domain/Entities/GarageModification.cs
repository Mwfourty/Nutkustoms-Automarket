using NtkstmsAutoMarket.Domain.Common;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Domain.Entities;

public class GarageModification : BaseEntity
{
    public Guid GarageVehicleId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public GarageModificationCategory Category { get; private set; }

    public string? Brand { get; private set; }

    public string? Description { get; private set; }

    public DateOnly? InstalledDate { get; private set; }

    public decimal? Cost { get; private set; }

    public GarageVehicle GarageVehicle { get; private set; } = null!;

    private GarageModification()
    {
    }

    public GarageModification(
        Guid garageVehicleId,
        string name,
        GarageModificationCategory category,
        string? brand,
        string? description,
        DateOnly? installedDate,
        decimal? cost)
    {
        Validate(
            garageVehicleId,
            name,
            brand,
            description,
            cost);

        GarageVehicleId = garageVehicleId;
        Name = name.Trim();
        Category = category;
        Brand = Normalize(brand);
        Description = Normalize(description);
        InstalledDate = installedDate;
        Cost = cost;
    }

    public void Update(
        string name,
        GarageModificationCategory category,
        string? brand,
        string? description,
        DateOnly? installedDate,
        decimal? cost)
    {
        Validate(
            GarageVehicleId,
            name,
            brand,
            description,
            cost);

        Name = name.Trim();
        Category = category;
        Brand = Normalize(brand);
        Description = Normalize(description);
        InstalledDate = installedDate;
        Cost = cost;

        MarkAsUpdated();
    }

    private static void Validate(
        Guid garageVehicleId,
        string name,
        string? brand,
        string? description,
        decimal? cost)
    {
        if (garageVehicleId == Guid.Empty)
        {
            throw new ArgumentException(
                "Garage vehicle is required.");
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Modification name is required.");
        }

        if (name.Length > 200)
        {
            throw new ArgumentException(
                "Modification name cannot exceed 200 characters.");
        }

        if (brand?.Length > 100)
        {
            throw new ArgumentException(
                "Brand cannot exceed 100 characters.");
        }

        if (description?.Length > 2000)
        {
            throw new ArgumentException(
                "Description cannot exceed 2000 characters.");
        }

        if (cost < 0)
        {
            throw new ArgumentException(
                "Cost cannot be negative.");
        }
    }

    private static string? Normalize(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
}
