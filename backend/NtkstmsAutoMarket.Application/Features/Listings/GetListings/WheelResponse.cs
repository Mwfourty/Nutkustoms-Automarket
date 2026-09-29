namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public class WheelResponse
{
    public Guid Id { get; set; }

    public string? Brand { get; set; }

    public string? Model { get; set; }

    public decimal Diameter { get; set; }

    public decimal Width { get; set; }

    public int? Offset { get; set; }

    public string? BoltPattern { get; set; }

    public string? Material { get; set; }

    public string? Colour { get; set; }

    public string? CompatibleMake { get; set; }

    public string? CompatibleModel { get; set; }

    public int? CompatibleYearFrom { get; set; }

    public int? CompatibleYearTo { get; set; }

    public int Quantity { get; set; }
}