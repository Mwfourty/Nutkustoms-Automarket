namespace NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.GetServiceRecords;

public class GetServiceRecordResponse
{
    public Guid Id { get; set; }

    public Guid GarageVehicleId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateOnly ServiceDate { get; set; }

    public int Mileage { get; set; }

    public string? ServiceProvider { get; set; }

    public decimal? Cost { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
