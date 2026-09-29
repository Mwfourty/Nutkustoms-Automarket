using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Garage.GetUserGarage;

public class GetUserGarageHandler
{
    private readonly IApplicationDbContext _context;

    public GetUserGarageHandler(
        IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<GetUserGarageVehicleResponse>> Handle(
        GetUserGarageQuery query,
        CancellationToken cancellationToken = default)
    {
        var userExists = await _context.Users
            .AsNoTracking()
            .AnyAsync(
                x => x.Id == query.UserId &&
                     x.IsActive,
                cancellationToken);

        if (!userExists)
        {
            throw new KeyNotFoundException(
                "User does not exist.");
        }

        return await _context.GarageVehicles
            .AsNoTracking()
            .Where(x => x.OwnerId == query.UserId &&
                        x.IsPublic)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new GetUserGarageVehicleResponse
            {
                Id = x.Id,
                Make = x.Make,
                Model = x.Model,
                Year = x.Year,
                Mileage = x.Mileage,
                EngineDetails = x.EngineDetails,
                Transmission = x.Transmission,
                Kilowatts = x.Kilowatts,
                Drivetrain = x.Drivetrain,
                FuelType = x.FuelType,
                BodyType = x.BodyType,
                Color = x.Color,
                IsPublic = x.IsPublic,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
