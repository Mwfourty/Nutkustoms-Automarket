using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public class EngineResponse
{
    public Guid Id { get; set; }

    public string Manufacturer { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public string? EngineCode { get; set; }

    public decimal? Displacement { get; set; }

    public int? Kilowatts { get; set; }

    public FuelType FuelType { get; set; }

    public int? Mileage { get; set; }

    public string? CompatibleMake { get; set; }

    public string? CompatibleModel { get; set; }

    public int? CompatibleYearFrom { get; set; }

    public int? CompatibleYearTo { get; set; }
}