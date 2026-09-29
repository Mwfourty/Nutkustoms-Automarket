using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class EngineConfiguration : IEntityTypeConfiguration<Engine>
{
    public void Configure(EntityTypeBuilder<Engine> builder)
    {
        builder.ToTable("engines");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Manufacturer)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Model)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.EngineCode)
            .HasMaxLength(100);

        builder.Property(x => x.Displacement)
            .HasPrecision(4, 1);

        builder.Property(x => x.Kilowatts);

        builder.Property(x => x.FuelType)
            .IsRequired();

        builder.Property(x => x.CompatibleMake)
            .HasMaxLength(100);

        builder.Property(x => x.CompatibleModel)
            .HasMaxLength(100);

        builder.HasIndex(x => x.ListingId)
            .IsUnique();

        builder.HasOne(x => x.Listing)
            .WithOne(x => x.Engine)
            .HasForeignKey<Engine>(x => x.ListingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}