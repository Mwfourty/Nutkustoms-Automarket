namespace NtkstmsAutoMarket.Application.Features.Garage.Images.AddGarageVehicleImage;

public record AddGarageVehicleImageRequest(
    string Url,
    bool IsPrimary = false);
