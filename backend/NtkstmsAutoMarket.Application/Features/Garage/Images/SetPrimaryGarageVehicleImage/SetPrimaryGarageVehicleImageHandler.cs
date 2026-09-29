using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.Images.SetPrimaryGarageVehicleImage;

public class SetPrimaryGarageVehicleImageHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public SetPrimaryGarageVehicleImageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<SetPrimaryGarageVehicleImageResult> Handle(
        SetPrimaryGarageVehicleImageCommand command,
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
                "You can only manage images on your own vehicles.");
        }

        var images = await _context.GarageVehicleImages
            .Where(x =>
                x.GarageVehicleId == command.GarageVehicleId)
            .ToListAsync(cancellationToken);

        var selectedImage = images
            .FirstOrDefault(x => x.Id == command.ImageId);

        if (selectedImage is null)
        {
            throw new KeyNotFoundException(
                "Garage vehicle image does not exist.");
        }

        foreach (var image in images)
        {
            if (image.Id == selectedImage.Id)
            {
                if (!image.IsPrimary)
                    image.SetAsPrimary();
            }
            else if (image.IsPrimary)
            {
                image.RemoveAsPrimary();
            }
        }

        await _context.SaveChangesAsync(
            cancellationToken);

        return new SetPrimaryGarageVehicleImageResult(
            selectedImage.Id,
            selectedImage.GarageVehicleId,
            selectedImage.Url,
            selectedImage.DisplayOrder,
            selectedImage.IsPrimary);
    }
}
