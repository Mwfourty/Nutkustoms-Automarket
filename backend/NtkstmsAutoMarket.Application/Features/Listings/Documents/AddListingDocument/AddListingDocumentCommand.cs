using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Listings.Documents.AddListingDocument;

public record AddListingDocumentCommand(
    Guid ListingId,
    string Name,
    ListingDocument.DocumentType Type,
    string Url);