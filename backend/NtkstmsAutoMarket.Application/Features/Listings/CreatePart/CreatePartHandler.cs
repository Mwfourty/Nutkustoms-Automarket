using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Parts.CreatePart;

public class CreatePartHandler
{
    private readonly IApplicationDbContext _context;

    public CreatePartHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CreatePartResponse> Handle(
        CreatePartCommand command,
        CancellationToken cancellationToken)
    {
        var listing = await _context.Listings
            .FirstOrDefaultAsync(
                x => x.Id == command.ListingId,
                cancellationToken);

        if (listing == null)
            throw new InvalidOperationException(
                "Listing not found.");

        if (listing.Part != null)
            throw new InvalidOperationException(
                "This listing already has a part.");

        var part = new Part(
            command.ListingId,
            command.Name,
            command.PartNumber,
            command.Description,
            command.Manufacturer,
            command.CompatibleMake,
            command.CompatibleModel,
            command.CompatibleYearFrom,
            command.CompatibleYearTo,
            command.Condition);

        await _context.Parts.AddAsync(
            part,
            cancellationToken);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new CreatePartResponse
        {
            PartId = part.Id
        };
    }
}