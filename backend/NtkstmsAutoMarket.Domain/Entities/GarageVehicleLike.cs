using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class GarageVehicleLike : BaseEntity
{
    public Guid UserId { get; private set; }

    public Guid GarageVehicleId { get; private set; }

    public User User { get; private set; } = null!;

    public GarageVehicle GarageVehicle { get; private set; } = null!;

    private GarageVehicleLike()
    {
    }

    public GarageVehicleLike(
        Guid userId,
        Guid garageVehicleId)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException(
                "User is required.");

        if (garageVehicleId == Guid.Empty)
            throw new ArgumentException(
                "Garage vehicle is required.");

        UserId = userId;
        GarageVehicleId = garageVehicleId;
    }
}
