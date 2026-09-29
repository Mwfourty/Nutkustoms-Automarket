using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Vehicles.CreateVehicle;

public record CreateVehicleCommand(
	Guid ListingId,
	string Make,
	string Model,
	int Year,
	int Mileage,
	string? Engine,
	string? Transmission,
	int? Kilowatts,
	Drivetrain Drivetrain,
	FuelType FuelType,
	BodyType BodyType,
	string? Colour,
	string? VIN
);