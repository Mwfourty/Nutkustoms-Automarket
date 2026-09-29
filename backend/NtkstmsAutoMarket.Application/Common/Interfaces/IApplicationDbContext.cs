using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }

    DbSet<Listing> Listings { get; }

    DbSet<Vehicle> Vehicles { get; }

    DbSet<GarageVehicle> GarageVehicles { get; }

    DbSet<GarageVehicleImage> GarageVehicleImages { get; }

    DbSet<GarageServiceRecord> GarageServiceRecords { get; }

    DbSet<GarageModification> GarageModifications { get; }

    DbSet<Part> Parts { get; }

    DbSet<Engine> Engines { get; }

    DbSet<Wheel> Wheels { get; }

    DbSet<ListingImage> ListingImages { get; }

    DbSet<ListingDocument> ListingDocuments { get; }

    DbSet<SellerReview> SellerReviews { get; }

    DbSet<MarketplaceConversation> MarketplaceConversations { get; }

    DbSet<MarketplaceMessage> MarketplaceMessages { get; }

    Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default);
}