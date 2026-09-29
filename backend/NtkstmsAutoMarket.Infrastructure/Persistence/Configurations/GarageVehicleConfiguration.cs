using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class GarageVehicleConfiguration
    : IEntityTypeConfiguration<GarageVehicle>
{
    public void Configure(
        EntityTypeBuilder<GarageVehicle> builder)
    {
        builder.ToTable("garage_vehicles");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Make)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Model)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.Year)
            .IsRequired();

        builder.Property(x => x.Mileage)
            .IsRequired();

        builder.Property(x => x.EngineDetails)
            .HasMaxLength(200);

        builder.Property(x => x.Transmission)
            .HasMaxLength(100);

        builder.Property(x => x.Color)
            .HasMaxLength(50);

        builder.Property(x => x.Vin)
            .HasMaxLength(50);

        builder.Property(x => x.IsPublic)
            .IsRequired();

        builder.HasOne(x => x.Owner)
            .WithMany()
            .HasForeignKey(x => x.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.OwnerId);

        builder.HasIndex(x => new
        {
            x.OwnerId,
            x.IsPublic
        });

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
