using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Application.Features.Listings.GetListings;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetMyListings;

public class GetMyListingsHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMyListingsHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetListingsResult> Handle(
        GetMyListingsQuery query,
        CancellationToken cancellationToken = default)
    {
        if (query.Page < 1)
            throw new ArgumentException(
                "Page must be greater than zero.");

        if (query.PageSize < 1 || query.PageSize > 100)
            throw new ArgumentException(
                "Page size must be between 1 and 100.");

        var userId = _currentUser.UserId;

        var listingsQuery = _context.Listings
            .AsNoTracking()
            .Where(listing =>
                listing.SellerId == userId);

        if (query.Status.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Status == query.Status.Value);
        }

        var totalCount = await listingsQuery.CountAsync(
            cancellationToken);

        var items = await listingsQuery
            .OrderByDescending(listing => listing.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(listing => new GetListingsResponse
            {
                Id = listing.Id,
                SellerId = listing.SellerId,
                Title = listing.Title,
                Description = listing.Description,
                Price = listing.Price,
                Type = listing.Type,
                Condition = listing.Condition,
                Status = listing.Status,
                Location = listing.Location,
                CreatedAt = listing.CreatedAt,

                Vehicle = listing.Vehicle == null
                    ? null
                    : new VehicleResponse
                    {
                        Id = listing.Vehicle.Id,
                        Make = listing.Vehicle.Make,
                        Model = listing.Vehicle.Model,
                        Year = listing.Vehicle.Year,
                        Mileage = listing.Vehicle.Mileage,
                        Engine = listing.Vehicle.Engine,
                        Transmission = listing.Vehicle.Transmission,
                        Kilowatts = listing.Vehicle.Kilowatts,
                        Drivetrain = listing.Vehicle.Drivetrain,
                        FuelType = listing.Vehicle.FuelType,
                        BodyType = listing.Vehicle.BodyType,
                        Colour = listing.Vehicle.Colour,
                        VIN = listing.Vehicle.VIN
                    },

                Part = listing.Part == null
                    ? null
                    : new PartResponse
                    {
                        Id = listing.Part.Id,
                        Name = listing.Part.Name,
                        PartNumber = listing.Part.PartNumber,
                        Description = listing.Part.Description,
                        Manufacturer = listing.Part.Manufacturer,
                        CompatibleMake = listing.Part.CompatibleMake,
                        CompatibleModel = listing.Part.CompatibleModel,
                        CompatibleYearFrom = listing.Part.CompatibleYearFrom,
                        CompatibleYearTo = listing.Part.CompatibleYearTo,
                        Condition = listing.Part.Condition
                    },

                Engine = listing.Engine == null
                    ? null
                    : new EngineResponse
                    {
                        Id = listing.Engine.Id,
                        Manufacturer = listing.Engine.Manufacturer,
                        Model = listing.Engine.Model,
                        EngineCode = listing.Engine.EngineCode,
                        Displacement = listing.Engine.Displacement,
                        Kilowatts = listing.Engine.Kilowatts,
                        FuelType = listing.Engine.FuelType,
                        Mileage = listing.Engine.Mileage,
                        CompatibleMake = listing.Engine.CompatibleMake,
                        CompatibleModel = listing.Engine.CompatibleModel,
                        CompatibleYearFrom = listing.Engine.CompatibleYearFrom,
                        CompatibleYearTo = listing.Engine.CompatibleYearTo
                    },

                Wheel = listing.Wheel == null
                    ? null
                    : new WheelResponse
                    {
                        Id = listing.Wheel.Id,
                        Brand = listing.Wheel.Brand,
                        Model = listing.Wheel.Model,
                        Diameter = listing.Wheel.Diameter,
                        Width = listing.Wheel.Width,
                        Offset = listing.Wheel.Offset,
                        BoltPattern = listing.Wheel.BoltPattern,
                        Material = listing.Wheel.Material,
                        Colour = listing.Wheel.Colour,
                        CompatibleMake = listing.Wheel.CompatibleMake,
                        CompatibleModel = listing.Wheel.CompatibleModel,
                        CompatibleYearFrom = listing.Wheel.CompatibleYearFrom,
                        CompatibleYearTo = listing.Wheel.CompatibleYearTo,
                        Quantity = listing.Wheel.Quantity
                    }
            })
            .ToListAsync(cancellationToken);

        return new GetListingsResult
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(
                totalCount / (double)query.PageSize)
        };
    }
}
