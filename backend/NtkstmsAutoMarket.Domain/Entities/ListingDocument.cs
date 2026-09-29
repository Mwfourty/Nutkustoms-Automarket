using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class ListingDocument : BaseEntity
{
    public Guid ListingId { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public DocumentType Type { get; private set; }

    public string Url { get; private set; } = string.Empty;

    public Listing Listing { get; private set; } = null!;

    private ListingDocument()
    {
    }

    public ListingDocument(
        Guid listingId,
        string name,
        DocumentType type,
        string url)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException(
                "Document name cannot be empty.");

        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException(
                "Document URL cannot be empty.");

        ListingId = listingId;
        Name = name;
        Type = type;
        Url = url;
    }

    public void UpdateDetails(
        string name,
        DocumentType type)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException(
                "Document name cannot be empty.");

        Name = name;
        Type = type;

        MarkAsUpdated();
    }

    public enum DocumentType
    {
        ServiceHistory = 1,
        Registration = 2,
        RoadworthyCertificate = 3,
        Invoice = 4,
        Receipt = 5,
        Warranty = 6,
        DynoSheet = 7,
        Other = 8
    }
}