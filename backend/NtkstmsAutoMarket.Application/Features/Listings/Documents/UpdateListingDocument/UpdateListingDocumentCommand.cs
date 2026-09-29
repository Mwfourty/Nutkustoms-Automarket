using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Listings.Documents.UpdateListingDocument;

public record UpdateListingDocumentCommand(
	Guid ListingId,
	Guid DocumentId,
	string Name,
	ListingDocument.DocumentType Type);