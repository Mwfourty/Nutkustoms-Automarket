using NtkstmsAutoMarket.Application.Features.Users.GetPublicProfile;

namespace NtkstmsAutoMarket.Application.Features.Garage.GetPublicGarage;

public class GetPublicGarageResult
{
    public GetPublicProfileResponse Owner { get; set; } = null!;

    public List<GetPublicGarageVehicleResponse> Vehicles { get; set; } = new();
}
