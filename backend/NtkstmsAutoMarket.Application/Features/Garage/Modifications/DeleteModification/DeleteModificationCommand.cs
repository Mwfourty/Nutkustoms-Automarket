namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.DeleteModification;

public record DeleteModificationCommand(
    Guid GarageVehicleId,
    Guid ModificationId);
