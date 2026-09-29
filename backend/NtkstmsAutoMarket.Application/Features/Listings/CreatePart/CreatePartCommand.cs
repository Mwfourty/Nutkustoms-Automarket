namespace NtkstmsAutoMarket.Application.Features.Parts.CreatePart;

public record CreatePartCommand(
    Guid ListingId,
    string Name,
    string? PartNumber,
    string? Description,
    string? Manufacturer,
    string? CompatibleMake,
    string? CompatibleModel,
    int? CompatibleYearFrom,
    int? CompatibleYearTo,
    string? Condition
);