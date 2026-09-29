using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Exceptions;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Listings.Documents.AddListingDocument;

public class AddListingDocumentHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public AddListingDocumentHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<AddListingDocumentResult> Handle(
        AddListingDocumentCommand command,
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

        var document = new ListingDocument(
            command.ListingId,
            command.Name,
            command.Type,
            command.Url);

        _context.ListingDocuments.Add(document);

        await _context.SaveChangesAsync(cancellationToken);

        return new AddListingDocumentResult(document.Id);
    }
}