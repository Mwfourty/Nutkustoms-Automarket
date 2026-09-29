using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.CreateModification;

public record CreateModificationCommand(
    Guid GarageVehicleId,
    string Name,
    GarageModificationCategory Category,
    string? Brand,
    string? Description,
    DateOnly? InstalledDate,
    decimal? Cost);
