using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Listings.Documents.DeleteListingDocument;

public class DeleteListingDocumentHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteListingDocumentHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<DeleteListingDocumentResult> Handle(
        DeleteListingDocumentCommand command,
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

        var document = await _context.ListingDocuments
            .FirstOrDefaultAsync(
                x => x.Id == command.DocumentId &&
                     x.ListingId == command.ListingId,
                cancellationToken);

        if (document is null)
            throw new KeyNotFoundException(
                "Listing document does not exist.");

        _context.ListingDocuments.Remove(document);

        await _context.SaveChangesAsync(cancellationToken);

        return new DeleteListingDocumentResult(document.Id);
    }
}