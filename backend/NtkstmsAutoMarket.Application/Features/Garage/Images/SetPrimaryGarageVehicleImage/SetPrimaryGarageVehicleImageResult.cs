namespace NtkstmsAutoMarket.Application.Features.Garage.Images.SetPrimaryGarageVehicleImage;

public record SetPrimaryGarageVehicleImageResult(
    Guid Id,
    Guid GarageVehicleId,
    string Url,
    int DisplayOrder,
    bool IsPrimary);
