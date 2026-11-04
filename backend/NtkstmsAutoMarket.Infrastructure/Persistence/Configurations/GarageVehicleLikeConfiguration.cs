using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class GarageVehicleLikeConfiguration
    : IEntityTypeConfiguration<GarageVehicleLike>
{
    public void Configure(
        EntityTypeBuilder<GarageVehicleLike> builder)
    {
        builder.ToTable("garage_vehicle_likes");

        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.GarageVehicle)
            .WithMany()
            .HasForeignKey(x => x.GarageVehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new
        {
            x.UserId,
            x.GarageVehicleId
        })
        .IsUnique();

        builder.HasIndex(x => x.GarageVehicleId);

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
