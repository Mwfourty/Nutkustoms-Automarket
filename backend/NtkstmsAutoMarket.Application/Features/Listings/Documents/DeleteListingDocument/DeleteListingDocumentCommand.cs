namespace NtkstmsAutoMarket.Application.Features.Listings.Documents.DeleteListingDocument;

public record DeleteListingDocumentCommand(
	Guid ListingId,
	Guid DocumentId);