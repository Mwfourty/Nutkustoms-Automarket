using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.UpdateModification;

public record UpdateModificationResult(
    Guid Id,
    Guid GarageVehicleId,
    string Name,
    GarageModificationCategory Category,
    string? Brand,
    string? Description,
    DateOnly? InstalledDate,
    decimal? Cost,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
