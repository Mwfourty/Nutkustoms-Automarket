using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public class GetListingsHandler
{
    private readonly IApplicationDbContext _context;

    public GetListingsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GetListingsResult> Handle(
        GetListingsQuery query,
        CancellationToken cancellationToken)
    {
        if (query.Page < 1)
            throw new ArgumentException(
                "Page must be greater than zero.");

        if (query.PageSize < 1 || query.PageSize > 100)
            throw new ArgumentException(
                "Page size must be between 1 and 100.");

        var listingsQuery = _context.Listings
            .AsNoTracking()
            .Where(listing =>
                listing.Status == ListingStatus.Active);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();

            listingsQuery = listingsQuery.Where(listing =>
                listing.Title.ToLower().Contains(search) ||
                listing.Description.ToLower().Contains(search));
        }

        if (query.Type.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Type == query.Type.Value);
        }

        if (query.Condition.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Condition == query.Condition.Value);
        }

        if (query.MinPrice.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Price >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            listingsQuery = listingsQuery.Where(listing =>
                listing.Price <= query.MaxPrice.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Location))
        {
            var location = query.Location.Trim().ToLower();

            listingsQuery = listingsQuery.Where(listing =>
                listing.Location != null &&
                listing.Location.ToLower().Contains(location));
        }

        var sortBy = query.SortBy?.Trim().ToLowerInvariant();
        var sortDirection = query.SortDirection?.Trim().ToLowerInvariant();

        listingsQuery = (sortBy, sortDirection) switch
        {
            ("price", "asc") =>
                listingsQuery.OrderBy(listing => listing.Price),

            ("price", "desc") =>
                listingsQuery.OrderByDescending(listing => listing.Price),

            ("title", "asc") =>
                listingsQuery.OrderBy(listing => listing.Title),

            ("title", "desc") =>
                listingsQuery.OrderByDescending(listing => listing.Title),

            ("createdat", "asc") =>
                listingsQuery.OrderBy(listing => listing.CreatedAt),

            ("createdat", "desc") =>
                listingsQuery.OrderByDescending(listing => listing.CreatedAt),

            _ =>
                listingsQuery.OrderByDescending(listing => listing.CreatedAt)
        };

        var totalCount = await listingsQuery.CountAsync(
            cancellationToken);

        var items = await listingsQuery
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