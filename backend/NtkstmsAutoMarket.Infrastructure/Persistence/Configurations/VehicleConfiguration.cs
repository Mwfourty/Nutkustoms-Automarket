using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ToTable("vehicles");

        builder.HasKey(v => v.Id);

        builder.Property(v => v.Make)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(v => v.Model)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(v => v.Year)
            .IsRequired();

        builder.Property(v => v.Mileage)
            .IsRequired();

        builder.Property(v => v.Engine)
            .HasMaxLength(100);

        builder.Property(v => v.Transmission)
            .HasMaxLength(50);

        builder.Property(v => v.Kilowatts);

        builder.Property(v => v.Drivetrain);

        builder.Property(v => v.FuelType)
            .HasMaxLength(50);

        builder.Property(v => v.BodyType)
            .HasMaxLength(50);

        builder.Property(v => v.Colour)
            .HasMaxLength(50);

        builder.Property(v => v.VIN)
            .HasMaxLength(17);

        builder.HasIndex(v => v.VIN)
            .IsUnique();

        builder.HasOne(v => v.Listing)
            .WithOne()
            .HasForeignKey<Vehicle>(v => v.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(v => v.CreatedAt)
            .IsRequired();
    }
}