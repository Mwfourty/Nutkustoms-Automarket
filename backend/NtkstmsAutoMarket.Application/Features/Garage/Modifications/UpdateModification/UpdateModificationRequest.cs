using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.UpdateModification;

public record UpdateModificationRequest(
    string Name,
    GarageModificationCategory Category,
    string? Brand,
    string? Description,
    DateOnly? InstalledDate,
    decimal? Cost);
