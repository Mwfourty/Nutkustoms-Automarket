namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public class PartResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? PartNumber { get; set; }

    public string? Description { get; set; }

    public string? Manufacturer { get; set; }

    public string? CompatibleMake { get; set; }

    public string? CompatibleModel { get; set; }

    public int? CompatibleYearFrom { get; set; }

    public int? CompatibleYearTo { get; set; }

    public string? Condition { get; set; }
}