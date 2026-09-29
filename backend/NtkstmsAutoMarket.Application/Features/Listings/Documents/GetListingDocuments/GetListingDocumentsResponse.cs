using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Listings.Documents.GetListingDocuments;

public class GetListingDocumentsResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public ListingDocument.DocumentType Type { get; set; }

    public string Url { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}