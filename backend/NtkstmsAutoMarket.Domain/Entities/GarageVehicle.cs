using NtkstmsAutoMarket.Domain.Common;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Domain.Entities;

public class GarageVehicle : BaseEntity
{
    public Guid OwnerId { get; private set; }

    public string Make { get; private set; } = string.Empty;

    public string Model { get; private set; } = string.Empty;

    public int Year { get; private set; }

    public int Mileage { get; private set; }

    public string? EngineDetails { get; private set; }

    public string? Transmission { get; private set; }

    public int? Kilowatts { get; private set; }

    public Drivetrain? Drivetrain { get; private set; }

    public FuelType? FuelType { get; private set; }

    public BodyType? BodyType { get; private set; }

    public string? Color { get; private set; }

    public string? Vin { get; private set; }

    public bool IsPublic { get; private set; }

    public User Owner { get; private set; } = null!;

    private GarageVehicle()
    {
    }

    public GarageVehicle(
        Guid ownerId,
        string make,
        string model,
        int year,
        int mileage,
        string? engineDetails,
        string? transmission,
        int? kilowatts,
        Drivetrain? drivetrain,
        FuelType? fuelType,
        BodyType? bodyType,
        string? color,
        string? vin,
        bool isPublic)
    {
        if (ownerId == Guid.Empty)
            throw new ArgumentException("Owner is required.");

        if (string.IsNullOrWhiteSpace(make))
            throw new ArgumentException("Make is required.");

        if (string.IsNullOrWhiteSpace(model))
            throw new ArgumentException("Model is required.");

        if (year < 1886 || year > DateTime.UtcNow.Year + 1)
            throw new ArgumentException("Vehicle year is invalid.");

        if (mileage < 0)
            throw new ArgumentException("Mileage cannot be negative.");

        if (kilowatts < 0)
            throw new ArgumentException("Kilowatts cannot be negative.");

        OwnerId = ownerId;
        Make = make.Trim();
        Model = model.Trim();
        Year = year;
        Mileage = mileage;
        EngineDetails = Normalize(engineDetails);
        Transmission = Normalize(transmission);
        Kilowatts = kilowatts;
        Drivetrain = drivetrain;
        FuelType = fuelType;
        BodyType = bodyType;
        Color = Normalize(color);
        Vin = Normalize(vin);
        IsPublic = isPublic;
    }

    public void UpdateDetails(
        string make,
        string model,
        int year,
        int mileage,
        string? engineDetails,
        string? transmission,
        int? kilowatts,
        Drivetrain? drivetrain,
        FuelType? fuelType,
        BodyType? bodyType,
        string? color,
        string? vin)
    {
        if (string.IsNullOrWhiteSpace(make))
            throw new ArgumentException("Make is required.");

        if (string.IsNullOrWhiteSpace(model))
            throw new ArgumentException("Model is required.");

        if (year < 1886 || year > DateTime.UtcNow.Year + 1)
            throw new ArgumentException("Vehicle year is invalid.");

        if (mileage < 0)
            throw new ArgumentException("Mileage cannot be negative.");

        if (kilowatts < 0)
            throw new ArgumentException("Kilowatts cannot be negative.");

        Make = make.Trim();
        Model = model.Trim();
        Year = year;
        Mileage = mileage;
        EngineDetails = Normalize(engineDetails);
        Transmission = Normalize(transmission);
        Kilowatts = kilowatts;
        Drivetrain = drivetrain;
        FuelType = fuelType;
        BodyType = bodyType;
        Color = Normalize(color);
        Vin = Normalize(vin);

        MarkAsUpdated();
    }

    public void UpdateMileage(int mileage)
    {
        if (mileage < 0)
            throw new ArgumentException("Mileage cannot be negative.");

        Mileage = mileage;
        MarkAsUpdated();
    }

    public void MakePublic()
    {
        IsPublic = true;
        MarkAsUpdated();
    }

    public void MakePrivate()
    {
        IsPublic = false;
        MarkAsUpdated();
    }

    private static string? Normalize(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
}
