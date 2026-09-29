using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.GetModifications;

public class GetModificationResponse
{
    public Guid Id { get; set; }

    public Guid GarageVehicleId { get; set; }

    public string Name { get; set; } = string.Empty;

    public GarageModificationCategory Category { get; set; }

    public string? Brand { get; set; }

    public string? Description { get; set; }

    public DateOnly? InstalledDate { get; set; }

    public decimal? Cost { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
