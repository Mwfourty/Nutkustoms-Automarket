using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class ListingImageConfiguration
    : IEntityTypeConfiguration<ListingImage>
{
    public void Configure(
        EntityTypeBuilder<ListingImage> builder)
    {
        builder.ToTable("listing_images");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Url)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(x => x.DisplayOrder)
            .IsRequired();

        builder.Property(x => x.IsPrimary)
            .IsRequired();

        builder.HasOne(x => x.Listing)
            .WithMany(x => x.Images)
            .HasForeignKey(x => x.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.ListingId);

        builder.HasIndex(x => new
        {
            x.ListingId,
            x.DisplayOrder
        });
    }
}