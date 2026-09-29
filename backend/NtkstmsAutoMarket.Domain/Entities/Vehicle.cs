using NtkstmsAutoMarket.Domain.Common;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Domain.Entities;

public class Vehicle : BaseEntity
{
    public Guid ListingId { get; private set; }

    public string Make { get; private set; } = string.Empty;

    public string Model { get; private set; } = string.Empty;

    public int Year { get; private set; }

    public int Mileage { get; private set; }

    public string? Engine { get; private set; }

    public string? Transmission { get; private set; }

    public int? Kilowatts { get; private set; }

    public Drivetrain Drivetrain { get; private set; }

    public FuelType FuelType { get; private set; }

    public BodyType BodyType { get; private set; }

    public string? Colour { get; private set; }

    public string? VIN { get; private set; }

    public Listing Listing { get; private set; } = null!;

    private Vehicle()
    {
    }

    public Vehicle(
        Guid listingId,
        string make,
        string model,
        int year,
        int mileage,
        string? engine,
        string? transmission,
        int? kilowatts,
        Drivetrain drivetrain,
        FuelType fuelType,
        BodyType bodyType,
        string? colour,
        string? vin)
    {
        ListingId = listingId;
        Make = make;
        Model = model;
        Year = year;
        Mileage = mileage;
        Engine = engine;
        Transmission = transmission;
        Kilowatts = kilowatts;
        Drivetrain = drivetrain;
        FuelType = fuelType;
        BodyType = bodyType;
        Colour = colour;
        VIN = vin;
    }

    public void UpdateMileage(int mileage)
    {
        if (mileage < 0)
            throw new ArgumentException(
                "Mileage cannot be negative.");

        Mileage = mileage;

        MarkAsUpdated();
    }

    public void UpdateDetails(
    string make,
    string model,
    int year,
    string? engine,
    string? transmission,
    int? kilowatts,
    Drivetrain drivetrain,
    FuelType fuelType,
    BodyType bodyType,
    string? colour)
    {
        Make = make;
        Model = model;
        Year = year;
        Engine = engine;
        Transmission = transmission;
        Kilowatts = kilowatts;
        Drivetrain = drivetrain;
        FuelType = fuelType;
        BodyType = bodyType;
        Colour = colour;

        MarkAsUpdated();
    }
}