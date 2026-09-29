namespace NtkstmsAutoMarket.Application.Features.Garage.Images.DeleteGarageVehicleImage;

public record DeleteGarageVehicleImageCommand(
    Guid GarageVehicleId,
    Guid ImageId);
