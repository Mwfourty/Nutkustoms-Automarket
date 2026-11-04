using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage;

public static class GarageVisibility
{
    /// <summary>
    /// A vehicle is readable by its owner, when public, or while it has an active marketplace listing.
    /// Otherwise it behaves as if it does not exist, so private vehicle IDs cannot be probed.
    /// </summary>
    public static async Task EnsureCanView(
        IApplicationDbContext context,
        GarageVehicle vehicle,
        Guid? currentUserId,
        CancellationToken cancellationToken)
    {
        if (vehicle.IsPublic ||
            (currentUserId.HasValue && vehicle.OwnerId == currentUserId.Value))
        {
            return;
        }

        var hasActiveListing = await context.Listings
            .AnyAsync(
                x => x.SourceGarageVehicleId == vehicle.Id &&
                     x.Status == ListingStatus.Active,
                cancellationToken);

        if (!hasActiveListing)
        {
            throw new KeyNotFoundException(
                "Garage vehicle does not exist.");
        }
    }
}
