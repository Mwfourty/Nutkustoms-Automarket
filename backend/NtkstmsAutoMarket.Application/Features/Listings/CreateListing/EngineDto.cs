using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.CreateListing;

public record EngineDto(
    string Manufacturer,
    string Model,
    string? EngineCode,
    decimal? Displacement,
    int? Kilowatts,
    FuelType FuelType,
    int? Mileage,
    string? CompatibleMake,
    string? CompatibleModel,
    int? CompatibleYearFrom,
    int? CompatibleYearTo);