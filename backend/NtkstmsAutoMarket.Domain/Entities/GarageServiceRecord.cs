using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class GarageServiceRecord : BaseEntity
{
    public Guid GarageVehicleId { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string? Description { get; private set; }

    public DateOnly ServiceDate { get; private set; }

    public int Mileage { get; private set; }

    public string? ServiceProvider { get; private set; }

    public decimal? Cost { get; private set; }

    public GarageVehicle GarageVehicle { get; private set; } = null!;

    private GarageServiceRecord()
    {
    }

    public GarageServiceRecord(
        Guid garageVehicleId,
        string title,
        string? description,
        DateOnly serviceDate,
        int mileage,
        string? serviceProvider,
        decimal? cost)
    {
        if (garageVehicleId == Guid.Empty)
            throw new ArgumentException(
                "Garage vehicle is required.");

        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException(
                "Service title is required.");

        if (title.Length > 200)
            throw new ArgumentException(
                "Service title cannot exceed 200 characters.");

        if (description?.Length > 2000)
            throw new ArgumentException(
                "Description cannot exceed 2000 characters.");

        if (serviceProvider?.Length > 200)
            throw new ArgumentException(
                "Service provider cannot exceed 200 characters.");

        if (mileage < 0)
            throw new ArgumentException(
                "Mileage cannot be negative.");

        if (cost < 0)
            throw new ArgumentException(
                "Cost cannot be negative.");

        GarageVehicleId = garageVehicleId;
        Title = title.Trim();

        Description = string.IsNullOrWhiteSpace(description)
            ? null
            : description.Trim();

        ServiceDate = serviceDate;
        Mileage = mileage;

        ServiceProvider = string.IsNullOrWhiteSpace(serviceProvider)
            ? null
            : serviceProvider.Trim();

        Cost = cost;
    }

    public void Update(
        string title,
        string? description,
        DateOnly serviceDate,
        int mileage,
        string? serviceProvider,
        decimal? cost)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException(
                "Service title is required.");

        if (title.Length > 200)
            throw new ArgumentException(
                "Service title cannot exceed 200 characters.");

        if (description?.Length > 2000)
            throw new ArgumentException(
                "Description cannot exceed 2000 characters.");

        if (serviceProvider?.Length > 200)
            throw new ArgumentException(
                "Service provider cannot exceed 200 characters.");

        if (mileage < 0)
            throw new ArgumentException(
                "Mileage cannot be negative.");

        if (cost < 0)
            throw new ArgumentException(
                "Cost cannot be negative.");

        Title = title.Trim();

        Description = string.IsNullOrWhiteSpace(description)
            ? null
            : description.Trim();

        ServiceDate = serviceDate;
        Mileage = mileage;

        ServiceProvider = string.IsNullOrWhiteSpace(serviceProvider)
            ? null
            : serviceProvider.Trim();

        Cost = cost;

        MarkAsUpdated();
    }
}
