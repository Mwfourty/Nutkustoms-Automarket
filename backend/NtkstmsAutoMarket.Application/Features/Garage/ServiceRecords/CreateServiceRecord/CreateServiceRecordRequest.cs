namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.CreateServiceRecord;

public record CreateServiceRecordRequest(
    string Title,
    string? Description,
    DateOnly ServiceDate,
    int Mileage,
    string? ServiceProvider,
    decimal? Cost);
