using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Garage.GetGarageDirectory;

/// <summary>
/// Lists owners that have at least one public vehicle. Garages made of private
/// (unlisted) vehicles never appear here; they are only reachable by link.
/// </summary>
public class GetGarageDirectoryHandler
{
    private const int MaxPageSize = 50;
    private const int TitlesPerGarage = 3;

    private readonly IApplicationDbContext _context;

    public GetGarageDirectoryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GetGarageDirectoryResult> Handle(
        GetGarageDirectoryQuery query,
        CancellationToken cancellationToken = default)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, MaxPageSize);
        var search = query.Search?.Trim().ToLower();

        var owners = _context.Users
            .AsNoTracking()
            .Where(u =>
                u.IsActive &&
                u.ProfileVisibility == ProfileVisibility.Public &&
                _context.GarageVehicles.Any(v =>
                    v.OwnerId == u.Id && v.IsPublic));

        if (!string.IsNullOrEmpty(search))
        {
            owners = owners.Where(u =>
                u.Username.ToLower().Contains(search) ||
                u.FirstName.ToLower().Contains(search) ||
                u.LastName.ToLower().Contains(search) ||
                (u.City != null && u.City.ToLower().Contains(search)) ||
                (u.Province != null && u.Province.ToLower().Contains(search)) ||
                _context.GarageVehicles.Any(v =>
                    v.OwnerId == u.Id &&
                    v.IsPublic &&
                    (v.Make.ToLower().Contains(search) ||
                     v.Model.ToLower().Contains(search))));
        }

        var total = await owners.CountAsync(cancellationToken);

        var pageOwners = await owners
            .OrderByDescending(u => _context.GarageVehicles
                .Where(v => v.OwnerId == u.Id && v.IsPublic)
                .Max(v => v.CreatedAt))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new GarageDirectoryEntry
            {
                OwnerId = u.Id,
                Username = u.Username,
                FirstName = u.FirstName,
                LastName = u.LastName,
                ProfileImageUrl = u.ProfileImageUrl,
                City = u.City,
                Province = u.Province,
                IsVerified = u.IsVerified,
                VehicleCount = _context.GarageVehicles
                    .Count(v => v.OwnerId == u.Id && v.IsPublic),
                ForSaleCount = _context.GarageVehicles
                    .Count(v =>
                        v.OwnerId == u.Id &&
                        v.IsPublic &&
                        _context.Listings.Any(l =>
                            l.SourceGarageVehicleId == v.Id &&
                            l.Status == ListingStatus.Active)),
                LastUpdatedAt = _context.GarageVehicles
                    .Where(v => v.OwnerId == u.Id && v.IsPublic)
                    .Max(v => v.CreatedAt)
            })
            .ToListAsync(cancellationToken);

        foreach (var entry in pageOwners)
        {
            var vehicles = await _context.GarageVehicles
                .AsNoTracking()
                .Where(v => v.OwnerId == entry.OwnerId && v.IsPublic)
                .OrderByDescending(v => v.CreatedAt)
                .Take(TitlesPerGarage)
                .Select(v => new
                {
                    v.Id,
                    Title = v.Year + " " + v.Make + " " + v.Model
                })
                .ToListAsync(cancellationToken);

            entry.VehicleTitles = vehicles.Select(v => v.Title).ToList();

            if (vehicles.Count > 0)
            {
                var ids = vehicles.Select(v => v.Id).ToList();

                entry.CoverImageUrl = await _context.GarageVehicleImages
                    .AsNoTracking()
                    .Where(i => ids.Contains(i.GarageVehicleId) && i.IsPrimary)
                    .Select(i => i.Url)
                    .FirstOrDefaultAsync(cancellationToken);
            }
        }

        return new GetGarageDirectoryResult
        {
            Items = pageOwners,
            TotalCount = total
        };
    }
}
