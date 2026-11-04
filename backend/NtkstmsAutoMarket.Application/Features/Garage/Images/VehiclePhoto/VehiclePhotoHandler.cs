using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Application.Features.Users.ProfileImage;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Garage.Images.VehiclePhoto;

// Each vehicle has one uploaded cover photo, stored by vehicle id and exposed as its primary image.
public class VehiclePhotoHandler
{
    public const int MaxBytes = 4 * 1024 * 1024;

    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IGarageImageStorage _storage;

    public VehiclePhotoHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IGarageImageStorage storage)
    {
        _context = context;
        _currentUser = currentUser;
        _storage = storage;
    }

    public async Task<string> Upload(
        Guid vehicleId,
        byte[] content,
        CancellationToken cancellationToken = default)
    {
        if (content.Length == 0)
            throw new ArgumentException("No image was uploaded.");

        if (content.Length > MaxBytes)
            throw new ArgumentException("Image must be 4 MB or smaller.");

        var contentType = ProfileImageHandler.Detect(content)
            ?? throw new ArgumentException(
                "Only JPEG, PNG or WebP images are allowed.");

        await EnsureOwner(vehicleId, cancellationToken);

        await _storage.Save(vehicleId, content, contentType, cancellationToken);

        var existing = await _context.GarageVehicleImages
            .Where(x => x.GarageVehicleId == vehicleId)
            .ToListAsync(cancellationToken);

        _context.GarageVehicleImages.RemoveRange(existing);

        var url =
            $"/api/Garage/vehicles/{vehicleId}/photo?v={DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

        _context.GarageVehicleImages.Add(
            new GarageVehicleImage(vehicleId, url, 0, true));

        await _context.SaveChangesAsync(cancellationToken);

        return url;
    }

    public async Task Remove(
        Guid vehicleId,
        CancellationToken cancellationToken = default)
    {
        await EnsureOwner(vehicleId, cancellationToken);

        await _storage.Delete(vehicleId);

        var existing = await _context.GarageVehicleImages
            .Where(x => x.GarageVehicleId == vehicleId)
            .ToListAsync(cancellationToken);

        _context.GarageVehicleImages.RemoveRange(existing);

        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureOwner(
        Guid vehicleId,
        CancellationToken cancellationToken)
    {
        var vehicle = await _context.GarageVehicles
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == vehicleId, cancellationToken)
            ?? throw new KeyNotFoundException("Garage vehicle does not exist.");

        if (vehicle.OwnerId != _currentUser.UserId)
            throw new ForbiddenException(
                "You can only change images on your own vehicles.");
    }
}
