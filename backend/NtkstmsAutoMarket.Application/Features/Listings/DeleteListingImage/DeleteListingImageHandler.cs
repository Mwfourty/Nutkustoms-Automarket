using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Listings.DeleteListingImage;

public class DeleteListingImageHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteListingImageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<DeleteListingImageResult> Handle(
        DeleteListingImageCommand command,
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

        _context.ListingImages.Remove(image);

        await _context.SaveChangesAsync(cancellationToken);

        return new DeleteListingImageResult(image.Id);
    }
}