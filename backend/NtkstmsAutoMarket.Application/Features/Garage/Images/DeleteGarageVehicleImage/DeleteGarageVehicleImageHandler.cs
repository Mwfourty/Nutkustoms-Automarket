using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.Images.DeleteGarageVehicleImage;

public class DeleteGarageVehicleImageHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteGarageVehicleImageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task Handle(
        DeleteGarageVehicleImageCommand command,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = _currentUser.UserId;

        var vehicle = await _context.GarageVehicles
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == command.GarageVehicleId,
                cancellationToken);

        if (vehicle is null)
        {
            throw new KeyNotFoundException(
                "Garage vehicle does not exist.");
        }

        if (vehicle.OwnerId != currentUserId)
        {
            throw new ForbiddenException(
                "You can only delete images from your own vehicles.");
        }

        var image = await _context.GarageVehicleImages
            .FirstOrDefaultAsync(
                x => x.Id == command.ImageId &&
                     x.GarageVehicleId == command.GarageVehicleId,
                cancellationToken);

        if (image is null)
        {
            throw new KeyNotFoundException(
                "Garage vehicle image does not exist.");
        }

        var wasPrimary = image.IsPrimary;

        _context.GarageVehicleImages.Remove(image);

        if (wasPrimary)
        {
            var nextImage = await _context.GarageVehicleImages
                .Where(x =>
                    x.GarageVehicleId == command.GarageVehicleId &&
                    x.Id != command.ImageId)
                .OrderBy(x => x.DisplayOrder)
                .ThenBy(x => x.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (nextImage is not null)
            {
                nextImage.SetAsPrimary();
            }
        }

        await _context.SaveChangesAsync(
            cancellationToken);
    }
}
