using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class PartConfiguration : IEntityTypeConfiguration<Part>
{
    public void Configure(EntityTypeBuilder<Part> builder)
    {
        builder.ToTable("parts");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(x => x.PartNumber)
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(1000);

        builder.Property(x => x.Manufacturer)
            .HasMaxLength(100);

        builder.Property(x => x.CompatibleMake)
            .HasMaxLength(100);

        builder.Property(x => x.CompatibleModel)
            .HasMaxLength(100);

        builder.HasIndex(x => x.ListingId)
            .IsUnique();

        builder.HasOne(x => x.Listing)
            .WithOne(x => x.Part)
            .HasForeignKey<Part>(x => x.ListingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}