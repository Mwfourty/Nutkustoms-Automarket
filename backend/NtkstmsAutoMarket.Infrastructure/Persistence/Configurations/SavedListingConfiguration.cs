using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class SavedListingConfiguration
    : IEntityTypeConfiguration<SavedListing>
{
    public void Configure(
        EntityTypeBuilder<SavedListing> builder)
    {
        builder.ToTable("saved_listings");

        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Listing)
            .WithMany()
            .HasForeignKey(x => x.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new
        {
            x.UserId,
            x.ListingId
        })
        .IsUnique();

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
