using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Listings.AddListingImage;

public class AddListingImageHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public AddListingImageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<AddListingImageResult> Handle(
        AddListingImageCommand command,
        CancellationToken cancellationToken = default)
    {
        var listing = await _context.Listings
            .FirstOrDefaultAsync(
                x => x.Id == command.ListingId,
                cancellationToken);

        if (listing is null)
            throw new KeyNotFoundException(
                "Listing does not exist.");

        if (listing.SellerId != _currentUser.UserId)
        {
            throw new ForbiddenException(
                "You do not have permission to modify this listing.");
        }

        if (command.IsPrimary)
        {
            var existingPrimaryImage = await _context.ListingImages
                .FirstOrDefaultAsync(
                    x => x.ListingId == command.ListingId &&
                         x.IsPrimary,
                    cancellationToken);

            existingPrimaryImage?.RemoveAsPrimary();
        }

        var image = new ListingImage(
            command.ListingId,
            command.Url,
            command.DisplayOrder,
            command.IsPrimary
        );

        _context.ListingImages.Add(image);

        await _context.SaveChangesAsync(cancellationToken);

        return new AddListingImageResult(image.Id);
    }
}