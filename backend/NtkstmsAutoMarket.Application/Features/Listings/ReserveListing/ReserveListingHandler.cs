using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Listings.ReserveListing;

public class ReserveListingHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public ReserveListingHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<ReserveListingResult> Handle(
        ReserveListingCommand command,
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

        listing.Reserve();

        await _context.SaveChangesAsync(cancellationToken);

        return new ReserveListingResult(
            listing.Id,
            listing.Status);
    }
}