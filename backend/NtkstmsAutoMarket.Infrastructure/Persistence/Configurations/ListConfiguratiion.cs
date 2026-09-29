using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class ListingConfiguration : IEntityTypeConfiguration<Listing>
{
    public void Configure(EntityTypeBuilder<Listing> builder)
    {
        builder.ToTable("listings");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(l => l.Description)
            .IsRequired()
            .HasMaxLength(5000);

        builder.Property(l => l.Price)
            .IsRequired()
            .HasPrecision(12, 2);

        builder.Property(l => l.Type)
            .IsRequired();

        builder.Property(l => l.Condition)
            .IsRequired();

        builder.Property(l => l.Status)
            .IsRequired();

        builder.Property(l => l.Location)
            .HasMaxLength(200);

        builder.HasOne(l => l.Seller)
            .WithMany()
            .HasForeignKey(l => l.SellerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.SourceGarageVehicle)
            .WithMany()
            .HasForeignKey(x => x.SourceGarageVehicleId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(x => x.SourceGarageVehicleId);

        builder.Property(l => l.CreatedAt)
            .IsRequired();
    }
}