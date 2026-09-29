namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.CreateServiceRecord;

public record CreateServiceRecordCommand(
    Guid GarageVehicleId,
    string Title,
    string? Description,
    DateOnly ServiceDate,
    int Mileage,
    string? ServiceProvider,
    decimal? Cost);
