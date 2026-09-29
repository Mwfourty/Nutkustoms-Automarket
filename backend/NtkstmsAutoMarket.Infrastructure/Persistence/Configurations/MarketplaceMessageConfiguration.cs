using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class MarketplaceMessageConfiguration
    : IEntityTypeConfiguration<MarketplaceMessage>
{
    public void Configure(
        EntityTypeBuilder<MarketplaceMessage> builder)
    {
        builder.ToTable("marketplace_messages");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Body)
            .HasMaxLength(4000)
            .IsRequired();

        builder.HasOne(x => x.Conversation)
            .WithMany()
            .HasForeignKey(x => x.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Sender)
            .WithMany()
            .HasForeignKey(x => x.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new
        {
            x.ConversationId,
            x.CreatedAt
        });

        builder.HasIndex(x => new
        {
            x.ConversationId,
            x.ReadAt
        });

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
