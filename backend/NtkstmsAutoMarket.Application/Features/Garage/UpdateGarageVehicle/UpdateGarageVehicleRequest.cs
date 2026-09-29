using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.UpdateGarageVehicle;

public record UpdateGarageVehicleRequest(
    string Make,
    string Model,
    int Year,
    int Mileage,
    string? EngineDetails,
    string? Transmission,
    int? Kilowatts,
    Drivetrain? Drivetrain,
    FuelType? FuelType,
    BodyType? BodyType,
    string? Color,
    string? Vin);
