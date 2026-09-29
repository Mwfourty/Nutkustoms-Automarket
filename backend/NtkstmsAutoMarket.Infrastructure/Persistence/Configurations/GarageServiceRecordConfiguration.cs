using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class GarageServiceRecordConfiguration
    : IEntityTypeConfiguration<GarageServiceRecord>
{
    public void Configure(
        EntityTypeBuilder<GarageServiceRecord> builder)
    {
        builder.ToTable("garage_service_records");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(2000);

        builder.Property(x => x.ServiceDate)
            .IsRequired();

        builder.Property(x => x.Mileage)
            .IsRequired();

        builder.Property(x => x.ServiceProvider)
            .HasMaxLength(200);

        builder.Property(x => x.Cost)
            .HasPrecision(12, 2);

        builder.HasOne(x => x.GarageVehicle)
            .WithMany()
            .HasForeignKey(x => x.GarageVehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.GarageVehicleId);

        builder.HasIndex(x => new
        {
            x.GarageVehicleId,
            x.ServiceDate
        });

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
