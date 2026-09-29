using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class GarageVehicleImage : BaseEntity
{
    public Guid GarageVehicleId { get; private set; }

    public string Url { get; private set; } = string.Empty;

    public int DisplayOrder { get; private set; }

    public bool IsPrimary { get; private set; }

    public GarageVehicle GarageVehicle { get; private set; } = null!;

    private GarageVehicleImage()
    {
    }

    public GarageVehicleImage(
        Guid garageVehicleId,
        string url,
        int displayOrder,
        bool isPrimary)
    {
        if (garageVehicleId == Guid.Empty)
            throw new ArgumentException(
                "Garage vehicle is required.");

        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException(
                "Image URL is required.");

        if (url.Length > 1000)
            throw new ArgumentException(
                "Image URL cannot exceed 1000 characters.");

        if (displayOrder < 0)
            throw new ArgumentException(
                "Display order cannot be negative.");

        GarageVehicleId = garageVehicleId;
        Url = url.Trim();
        DisplayOrder = displayOrder;
        IsPrimary = isPrimary;
    }

    public void SetAsPrimary()
    {
        IsPrimary = true;
        MarkAsUpdated();
    }

    public void RemoveAsPrimary()
    {
        IsPrimary = false;
        MarkAsUpdated();
    }

    public void UpdateDisplayOrder(int displayOrder)
    {
        if (displayOrder < 0)
            throw new ArgumentException(
                "Display order cannot be negative.");

        DisplayOrder = displayOrder;
        MarkAsUpdated();
    }
}
