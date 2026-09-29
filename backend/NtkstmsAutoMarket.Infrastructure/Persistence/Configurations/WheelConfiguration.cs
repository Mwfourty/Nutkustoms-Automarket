using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class WheelConfiguration : IEntityTypeConfiguration<Wheel>
{
    public void Configure(EntityTypeBuilder<Wheel> builder)
    {
        builder.ToTable("wheels");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Brand)
            .HasMaxLength(100);

        builder.Property(x => x.Model)
            .HasMaxLength(100);

        builder.Property(x => x.Diameter)
            .HasPrecision(4, 1);

        builder.Property(x => x.Width)
            .HasPrecision(4, 1);

        builder.Property(x => x.BoltPattern)
            .HasMaxLength(50);

        builder.Property(x => x.Material)
            .HasMaxLength(50);

        builder.Property(x => x.Colour)
            .HasMaxLength(50);

        builder.Property(x => x.CompatibleMake)
            .HasMaxLength(100);

        builder.Property(x => x.CompatibleModel)
            .HasMaxLength(100);

        builder.HasIndex(x => x.ListingId)
            .IsUnique();

        builder.HasOne(x => x.Listing)
            .WithOne(x => x.Wheel)
            .HasForeignKey<Wheel>(x => x.ListingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}