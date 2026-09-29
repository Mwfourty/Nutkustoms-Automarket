namespace NtkstmsAutoMarket.Application.Features.Garage.Images.SetPrimaryGarageVehicleImage;

public record SetPrimaryGarageVehicleImageCommand(
    Guid GarageVehicleId,
    Guid ImageId);
