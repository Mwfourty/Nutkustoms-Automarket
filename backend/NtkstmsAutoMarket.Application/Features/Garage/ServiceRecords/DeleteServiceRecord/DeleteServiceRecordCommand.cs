namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.DeleteServiceRecord;

public record DeleteServiceRecordCommand(
    Guid GarageVehicleId,
    Guid ServiceRecordId);
