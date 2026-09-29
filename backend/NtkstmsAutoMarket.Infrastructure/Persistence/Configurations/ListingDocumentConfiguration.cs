using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class ListingDocumentConfiguration
    : IEntityTypeConfiguration<ListingDocument>
{
    public void Configure(
        EntityTypeBuilder<ListingDocument> builder)
    {
        builder.ToTable("listing_documents");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.Type)
            .IsRequired();

        builder.Property(x => x.Url)
            .IsRequired()
            .HasMaxLength(1000);

        builder.HasOne(x => x.Listing)
            .WithMany(x => x.Documents)
            .HasForeignKey(x => x.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.ListingId);

        builder.HasIndex(x => x.Type);
    }
}