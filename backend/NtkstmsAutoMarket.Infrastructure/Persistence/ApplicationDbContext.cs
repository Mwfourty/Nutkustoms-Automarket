using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Domain.Entities;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Listing> Listings => Set<Listing>();

    public DbSet<Vehicle> Vehicles => Set<Vehicle>();

    public DbSet<GarageVehicle> GarageVehicles => Set<GarageVehicle>();

    public DbSet<GarageVehicleImage> GarageVehicleImages =>
        Set<GarageVehicleImage>();

    public DbSet<GarageServiceRecord> GarageServiceRecords => Set<GarageServiceRecord>();

    public DbSet<GarageModification> GarageModifications => Set<GarageModification>();

    public DbSet<Part> Parts => Set<Part>();

    public DbSet<Engine> Engines => Set<Engine>();

    public DbSet<Wheel> Wheels => Set<Wheel>();

    public DbSet<ListingImage> ListingImages => Set<ListingImage>();

    public DbSet<ListingDocument> ListingDocuments => Set<ListingDocument>();

    public DbSet<SellerReview> SellerReviews => Set<SellerReview>();

    public DbSet<MarketplaceConversation> MarketplaceConversations =>
        Set<MarketplaceConversation>();

    public DbSet<MarketplaceMessage> MarketplaceMessages =>
        Set<MarketplaceMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(ApplicationDbContext).Assembly);

        modelBuilder.Entity<Listing>()
        .HasOne(x => x.Vehicle)
        .WithOne(x => x.Listing)
        .HasForeignKey<Vehicle>(x => x.ListingId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
        .HasOne(x => x.Part)
        .WithOne(x => x.Listing)
        .HasForeignKey<Part>(x => x.ListingId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
        .HasOne(x => x.Engine)
        .WithOne(x => x.Listing)
        .HasForeignKey<Engine>(x => x.ListingId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
        .HasOne(x => x.Wheel)
        .WithOne(x => x.Listing)
        .HasForeignKey<Wheel>(x => x.ListingId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
        .HasMany(x => x.Documents)
        .WithOne(x => x.Listing)
        .HasForeignKey(x => x.ListingId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}