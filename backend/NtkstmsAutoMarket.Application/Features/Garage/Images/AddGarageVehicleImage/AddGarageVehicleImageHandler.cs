using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Garage.Images.AddGarageVehicleImage;

public class AddGarageVehicleImageHandler
{
    private const int MaxImagesPerVehicle = 20;

    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public AddGarageVehicleImageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<AddGarageVehicleImageResult> Handle(
        AddGarageVehicleImageCommand command,
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
                "You can only add images to your own vehicles.");
        }

        var existingImages = await _context.GarageVehicleImages
            .Where(x =>
                x.GarageVehicleId == command.GarageVehicleId)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync(cancellationToken);

        if (existingImages.Count >= MaxImagesPerVehicle)
        {
            throw new InvalidOperationException(
                $"A garage vehicle cannot have more than {MaxImagesPerVehicle} images.");
        }

        var displayOrder = existingImages.Count == 0
            ? 0
            : existingImages.Max(x => x.DisplayOrder) + 1;

        var shouldBePrimary =
            existingImages.Count == 0 ||
            command.IsPrimary;

        if (shouldBePrimary)
        {
            foreach (var existingImage in existingImages
                         .Where(x => x.IsPrimary))
            {
                existingImage.RemoveAsPrimary();
            }
        }

        var image = new GarageVehicleImage(
            command.GarageVehicleId,
            command.Url,
            displayOrder,
            shouldBePrimary);

        _context.GarageVehicleImages.Add(image);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new AddGarageVehicleImageResult(
            image.Id,
            image.GarageVehicleId,
            image.Url,
            image.DisplayOrder,
            image.IsPrimary,
            image.CreatedAt);
    }
}
