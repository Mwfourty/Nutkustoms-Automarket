namespace NtkstmsAutoMarket.Application.Features.Garage.Images.AddGarageVehicleImage;

public record AddGarageVehicleImageCommand(
    Guid GarageVehicleId,
    string Url,
    bool IsPrimary);
