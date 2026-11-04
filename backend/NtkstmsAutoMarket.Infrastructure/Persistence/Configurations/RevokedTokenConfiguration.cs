using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Infrastructure.Persistence.Configurations;

public class RevokedTokenConfiguration
    : IEntityTypeConfiguration<RevokedToken>
{
    public void Configure(
        EntityTypeBuilder<RevokedToken> builder)
    {
        builder.ToTable("revoked_tokens");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Jti)
            .IsRequired()
            .HasMaxLength(64);

        builder.HasIndex(x => x.Jti)
            .IsUnique();

        builder.HasIndex(x => x.ExpiresAt);

        builder.Property(x => x.ExpiresAt)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();
    }
}
