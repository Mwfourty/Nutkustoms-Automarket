using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public class GetListingsResponse
{
    public Guid Id { get; set; }

    public Guid SellerId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public ListingType Type { get; set; }

    public ListingCondition Condition { get; set; }

    public ListingStatus Status { get; set; }

    public string? Location { get; set; }

    public DateTime CreatedAt { get; set; }

    public VehicleResponse? Vehicle { get; set; }

    public PartResponse? Part { get; set; }

    public EngineResponse? Engine { get; set; }

    public WheelResponse? Wheel { get; set; }
}

public class VehicleResponse
{
    public Guid Id { get; set; }

    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public int Mileage { get; set; }

    public string? Engine { get; set; }

    public string? Transmission { get; set; }

    public int? Kilowatts { get; set; }

    public Drivetrain Drivetrain { get; set; }

    public FuelType FuelType { get; set; }

    public BodyType BodyType { get; set; }

    public string? Colour { get; set; }

    public string? VIN { get; set; }
}
