using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Listings.SetPrimaryListingImage;

public class SetPrimaryListingImageHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public SetPrimaryListingImageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<SetPrimaryListingImageResult> Handle(
        SetPrimaryListingImageCommand command,
        CancellationToken cancellationToken = default)
    {
        var listing = await _context.Listings
            .AsNoTracking()
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

        var image = await _context.ListingImages
            .FirstOrDefaultAsync(
                x => x.Id == command.ImageId &&
                     x.ListingId == command.ListingId,
                cancellationToken);

        if (image is null)
            throw new KeyNotFoundException(
                "Listing image does not exist.");

        var images = await _context.ListingImages
            .Where(x => x.ListingId == command.ListingId)
            .ToListAsync(cancellationToken);

        foreach (var listingImage in images)
        {
            if (listingImage.Id == image.Id)
                listingImage.SetAsPrimary();
            else
                listingImage.RemoveAsPrimary();
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new SetPrimaryListingImageResult(image.Id);
    }
}