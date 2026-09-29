namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.UpdateServiceRecord;

public record UpdateServiceRecordRequest(
    string Title,
    string? Description,
    DateOnly ServiceDate,
    int Mileage,
    string? ServiceProvider,
    decimal? Cost);
