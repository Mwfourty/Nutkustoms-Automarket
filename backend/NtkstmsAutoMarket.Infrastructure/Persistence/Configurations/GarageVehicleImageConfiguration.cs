using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class GarageVehicleImageConfiguration
    : IEntityTypeConfiguration<GarageVehicleImage>
{
    public void Configure(
        EntityTypeBuilder<GarageVehicleImage> builder)
    {
        builder.ToTable("garage_vehicle_images");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Url)
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(x => x.DisplayOrder)
            .IsRequired();

        builder.Property(x => x.IsPrimary)
            .IsRequired();

        builder.HasOne(x => x.GarageVehicle)
            .WithMany()
            .HasForeignKey(x => x.GarageVehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.GarageVehicleId);

        builder.HasIndex(x => new
        {
            x.GarageVehicleId,
            x.DisplayOrder
        });

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
