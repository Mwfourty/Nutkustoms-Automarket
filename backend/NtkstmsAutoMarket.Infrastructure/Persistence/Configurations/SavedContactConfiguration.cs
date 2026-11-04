using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class SavedContactConfiguration
    : IEntityTypeConfiguration<SavedContact>
{
    public void Configure(
        EntityTypeBuilder<SavedContact> builder)
    {
        builder.ToTable("saved_contacts");

        builder.HasKey(x => x.Id);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.ContactUser)
            .WithMany()
            .HasForeignKey(x => x.ContactUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new
        {
            x.UserId,
            x.ContactUserId
        })
        .IsUnique();

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
