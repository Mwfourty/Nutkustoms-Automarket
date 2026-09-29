using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class GarageModificationConfiguration
    : IEntityTypeConfiguration<GarageModification>
{
    public void Configure(
        EntityTypeBuilder<GarageModification> builder)
    {
        builder.ToTable("garage_modifications");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Category)
            .IsRequired();

        builder.Property(x => x.Brand)
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(2000);

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
            x.Category
        });

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
