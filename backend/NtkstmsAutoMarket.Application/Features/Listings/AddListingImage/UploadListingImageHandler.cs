using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Application.Features.Users.ProfileImage;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Listings.AddListingImage;

public record UploadListingImageResult(Guid ListingImageId, string Url);

// Stores an uploaded photo on disk and records it as a listing image.
public class UploadListingImageHandler
{
    public const int MaxBytes = 4 * 1024 * 1024;
    public const int MaxImagesPerListing = 20;

    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IListingImageStorage _storage;

    public UploadListingImageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IListingImageStorage storage)
    {
        _context = context;
        _currentUser = currentUser;
        _storage = storage;
    }

    public async Task<UploadListingImageResult> Handle(
        Guid listingId,
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

        var listing = await _context.Listings
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == listingId, cancellationToken)
            ?? throw new KeyNotFoundException("Listing does not exist.");

        if (listing.SellerId != _currentUser.UserId)
            throw new ForbiddenException(
                "You do not have permission to modify this listing.");

        var existingCount = await _context.ListingImages
            .CountAsync(x => x.ListingId == listingId, cancellationToken);

        if (existingCount >= MaxImagesPerListing)
            throw new InvalidOperationException(
                $"A listing can have at most {MaxImagesPerListing} images.");

        var image = new ListingImage(
            listingId,
            "pending",
            existingCount,
            existingCount == 0);

        // The URL embeds the image id, which only exists once the entity is created.
        var url = $"/api/Listings/{listingId}/images/{image.Id}/file";
        image.SetUrl(url);

        await _storage.Save(image.Id, content, contentType, cancellationToken);

        _context.ListingImages.Add(image);

        await _context.SaveChangesAsync(cancellationToken);

        return new UploadListingImageResult(image.Id, url);
    }
}
