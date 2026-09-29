namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.CreateServiceRecord;

public record CreateServiceRecordResult(
    Guid Id,
    Guid GarageVehicleId,
    string Title,
    string? Description,
    DateOnly ServiceDate,
    int Mileage,
    string? ServiceProvider,
    decimal? Cost,
    DateTime CreatedAt);
