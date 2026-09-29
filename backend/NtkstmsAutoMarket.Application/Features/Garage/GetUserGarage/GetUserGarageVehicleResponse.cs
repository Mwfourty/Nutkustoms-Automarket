using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.GetUserGarage;

public class GetUserGarageVehicleResponse
{
    public Guid Id { get; set; }

    public string Make { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public int Mileage { get; set; }

    public string? EngineDetails { get; set; }

    public string? Transmission { get; set; }

    public int? Kilowatts { get; set; }

    public Drivetrain? Drivetrain { get; set; }

    public FuelType? FuelType { get; set; }

    public BodyType? BodyType { get; set; }

    public string? Color { get; set; }

    public bool IsPublic { get; set; }

    public DateTime CreatedAt { get; set; }
}
