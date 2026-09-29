namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.UpdateServiceRecord;

public record UpdateServiceRecordCommand(
    Guid GarageVehicleId,
    Guid ServiceRecordId,
    string Title,
    string? Description,
    DateOnly ServiceDate,
    int Mileage,
    string? ServiceProvider,
    decimal? Cost);
