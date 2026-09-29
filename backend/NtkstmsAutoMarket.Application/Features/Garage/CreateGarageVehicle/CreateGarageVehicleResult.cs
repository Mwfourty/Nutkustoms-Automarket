using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.CreateGarageVehicle;

public record CreateGarageVehicleResult(
    Guid Id,
    Guid OwnerId,
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
    string? Vin,
    bool IsPublic,
    DateTime CreatedAt);
