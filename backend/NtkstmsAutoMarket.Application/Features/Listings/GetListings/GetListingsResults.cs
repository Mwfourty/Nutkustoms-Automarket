namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public class GetListingsResult
{
    public List<GetListingsResponse> Items { get; set; } = new();

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalCount { get; set; }

    public int TotalPages { get; set; }
}