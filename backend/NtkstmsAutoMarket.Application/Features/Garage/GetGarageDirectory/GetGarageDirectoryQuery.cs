namespace NtkstmsAutoMarket.Application.Features.Garage.GetGarageDirectory;

public record GetGarageDirectoryQuery(string? Search, int Page, int PageSize);

public class GarageDirectoryEntry
{
    public Guid OwnerId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? ProfileImageUrl { get; set; }

    public string? City { get; set; }

    public string? Province { get; set; }

    public bool IsVerified { get; set; }

    public int VehicleCount { get; set; }

    public int ForSaleCount { get; set; }

    public string? CoverImageUrl { get; set; }

    public List<string> VehicleTitles { get; set; } = new();

    public DateTime LastUpdatedAt { get; set; }
}

public class GetGarageDirectoryResult
{
    public List<GarageDirectoryEntry> Items { get; set; } = new();

    public int TotalCount { get; set; }
}
