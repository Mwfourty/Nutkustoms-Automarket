namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.UpdateServiceRecord;

public record UpdateServiceRecordResult(
    Guid Id,
    Guid GarageVehicleId,
    string Title,
    string? Description,
    DateOnly ServiceDate,
    int Mileage,
    string? ServiceProvider,
    decimal? Cost,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
