using System.Linq.Expressions;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Listings.GetListings;

public static class ListingProjections
{
    public static readonly Expression<Func<Listing, GetListingsResponse>> ToResponse =
        listing => new GetListingsResponse
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
            SourceGarageVehicleId = listing.SourceGarageVehicleId,

            PrimaryImageUrl = listing.Images
                .OrderByDescending(image => image.IsPrimary)
                .ThenBy(image => image.DisplayOrder)
                .Select(image => image.Url)
                .FirstOrDefault(),

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
        };
}
