using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.CreateListing;

public class VehicleDto
{
    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public int Mileage { get; set; }

    public string Engine { get; set; } = string.Empty;

    public string Transmission { get; set; } = string.Empty;

    public int? Kilowatts { get; set; }

    public Drivetrain Drivetrain { get; set; }

    public FuelType FuelType { get; set; }

    public BodyType BodyType { get; set; }

    public string Colour { get; set; } = string.Empty;

    public string? VIN { get; set; }
}