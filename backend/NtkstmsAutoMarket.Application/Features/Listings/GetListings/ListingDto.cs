using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public class ListingDto
{
    public Guid Id { get; set; }

    public Guid SellerId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public ListingType Type { get; set; }

    public ListingCondition Condition { get; set; }

    public ListingStatus Status { get; set; }

    public string? Location { get; set; }

    public DateTime CreatedAt { get; set; }
}