using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class MarketplaceConversationConfiguration
    : IEntityTypeConfiguration<MarketplaceConversation>
{
    public void Configure(
        EntityTypeBuilder<MarketplaceConversation> builder)
    {
        builder.ToTable("marketplace_conversations");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.LastMessageAt)
            .IsRequired();

        builder.HasOne(x => x.Listing)
            .WithMany()
            .HasForeignKey(x => x.ListingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Buyer)
            .WithMany()
            .HasForeignKey(x => x.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Seller)
            .WithMany()
            .HasForeignKey(x => x.SellerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new
        {
            x.ListingId,
            x.BuyerId
        })
        .IsUnique();

        builder.HasIndex(x => x.SellerId);

        builder.HasIndex(x => x.LastMessageAt);

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
