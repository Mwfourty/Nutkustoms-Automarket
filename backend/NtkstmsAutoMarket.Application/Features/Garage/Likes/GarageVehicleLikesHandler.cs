using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Garage.Likes;

public class GarageVehicleLikesHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GarageVehicleLikesHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GarageVehicleLikeStatus> GetStatus(
        Guid vehicleId,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserIdOrNull;

        var count = await _context.GarageVehicleLikes
            .CountAsync(
                like => like.GarageVehicleId == vehicleId,
                cancellationToken);

        var liked = currentUserId.HasValue &&
            await _context.GarageVehicleLikes
                .AnyAsync(
                    like =>
                        like.GarageVehicleId == vehicleId &&
                        like.UserId == currentUserId.Value,
                    cancellationToken);

        return new GarageVehicleLikeStatus(count, liked);
    }

    public async Task Like(
        Guid vehicleId,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        var vehicle = await _context.GarageVehicles
            .AsNoTracking()
            .Where(x => x.Id == vehicleId)
            .Select(x => new { x.OwnerId, x.IsPublic })
            .FirstOrDefaultAsync(cancellationToken);

        if (vehicle is null || !vehicle.IsPublic)
        {
            throw new KeyNotFoundException(
                "Vehicle does not exist.");
        }

        if (vehicle.OwnerId == userId)
        {
            throw new ArgumentException(
                "You cannot like your own vehicle.");
        }

        var alreadyLiked = await _context.GarageVehicleLikes
            .AnyAsync(
                x => x.UserId == userId && x.GarageVehicleId == vehicleId,
                cancellationToken);

        // Liking is idempotent so repeated clicks never fail.
        if (alreadyLiked)
            return;

        _context.GarageVehicleLikes.Add(
            new GarageVehicleLike(userId, vehicleId));

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task Unlike(
        Guid vehicleId,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        var like = await _context.GarageVehicleLikes
            .FirstOrDefaultAsync(
                x => x.UserId == userId && x.GarageVehicleId == vehicleId,
                cancellationToken);

        if (like is null)
            return;

        _context.GarageVehicleLikes.Remove(like);

        await _context.SaveChangesAsync(cancellationToken);
    }
}

public record GarageVehicleLikeStatus(int Count, bool Liked);
