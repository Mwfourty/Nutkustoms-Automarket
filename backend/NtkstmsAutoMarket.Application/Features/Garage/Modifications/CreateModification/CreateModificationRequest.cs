using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.Modifications.CreateModification;

public record CreateModificationRequest(
    string Name,
    GarageModificationCategory Category,
    string? Brand,
    string? Description,
    DateOnly? InstalledDate,
    decimal? Cost);
