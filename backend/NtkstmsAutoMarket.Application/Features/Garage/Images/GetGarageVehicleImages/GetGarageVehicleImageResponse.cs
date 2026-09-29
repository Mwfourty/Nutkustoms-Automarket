namespace NtkstmsAutoMarket.Application.Features.Garage.Images.GetGarageVehicleImages;

public class GetGarageVehicleImageResponse
{
    public Guid Id { get; set; }

    public string Url { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public bool IsPrimary { get; set; }

    public DateTime CreatedAt { get; set; }
}
