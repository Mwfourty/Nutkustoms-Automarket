using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class SellerReviewConfiguration
    : IEntityTypeConfiguration<SellerReview>
{
    public void Configure(
        EntityTypeBuilder<SellerReview> builder)
    {
        builder.ToTable("seller_reviews");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Rating)
            .IsRequired();

        builder.Property(x => x.Comment)
            .HasMaxLength(1000);

        builder.HasOne(x => x.Seller)
            .WithMany()
            .HasForeignKey(x => x.SellerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Reviewer)
            .WithMany()
            .HasForeignKey(x => x.ReviewerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Listing)
            .WithMany()
            .HasForeignKey(x => x.ListingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.SellerId);

        builder.HasIndex(x => x.ReviewerId);

        builder.HasIndex(x => new
        {
            x.ReviewerId,
            x.ListingId
        })
        .IsUnique();

        builder.ToTable(
            "seller_reviews",
            table =>
            {
                table.HasCheckConstraint(
                    "CK_seller_reviews_Rating",
                    "\"Rating\" >= 1 AND \"Rating\" <= 5");
            });

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
