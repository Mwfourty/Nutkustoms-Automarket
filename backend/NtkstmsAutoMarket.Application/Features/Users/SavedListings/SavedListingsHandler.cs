using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Application.Features.Listings.GetListings;
using NtkstmsAutoMarket.Domain.Entities;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Users.SavedListings;

public class SavedListingsHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public SavedListingsHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<GetListingsResponse>> GetAll(
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        // Removed listings stay hidden; sold ones remain visible so the user sees what happened.
        var items = await _context.SavedListings
            .AsNoTracking()
            .Where(saved =>
                saved.UserId == userId &&
                saved.Listing.Status != ListingStatus.Removed &&
                saved.Listing.Status != ListingStatus.Draft)
            .OrderByDescending(saved => saved.CreatedAt)
            .Select(saved => saved.Listing)
            .Select(ListingProjections.ToResponse)
            .ToListAsync(cancellationToken);

        await ListingLikeCounts.Apply(
            _context,
            items,
            cancellationToken);

        return items;
    }

    public async Task<IReadOnlyList<Guid>> GetIds(
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        return await _context.SavedListings
            .AsNoTracking()
            .Where(saved => saved.UserId == userId)
            .Select(saved => saved.ListingId)
            .ToListAsync(cancellationToken);
    }

    public async Task Save(
        Guid listingId,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        var listing = await _context.Listings
            .AsNoTracking()
            .Where(x => x.Id == listingId)
            .Select(x => new { x.SellerId, x.Status })
            .FirstOrDefaultAsync(cancellationToken);

        if (listing is null ||
            listing.Status == ListingStatus.Removed ||
            listing.Status == ListingStatus.Draft)
        {
            throw new KeyNotFoundException(
                "Listing does not exist.");
        }

        if (listing.SellerId == userId)
        {
            throw new ArgumentException(
                "You cannot save your own listing.");
        }

        var alreadySaved = await _context.SavedListings
            .AnyAsync(
                x => x.UserId == userId && x.ListingId == listingId,
                cancellationToken);

        // Saving is idempotent so repeated clicks never fail.
        if (alreadySaved)
            return;

        _context.SavedListings.Add(
            new SavedListing(userId, listingId));

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task Remove(
        Guid listingId,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        var saved = await _context.SavedListings
            .FirstOrDefaultAsync(
                x => x.UserId == userId && x.ListingId == listingId,
                cancellationToken);

        if (saved is null)
            return;

        _context.SavedListings.Remove(saved);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
