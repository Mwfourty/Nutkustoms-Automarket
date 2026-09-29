using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Users.GetPublicProfile;

public class GetPublicProfileHandler
{
    private readonly IApplicationDbContext _context;

    public GetPublicProfileHandler(
        IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GetPublicProfileResponse> Handle(
        GetPublicProfileQuery query,
        CancellationToken cancellationToken = default)
    {
        var user = await _context.Users
            .AsNoTracking()
            .Where(x =>
                x.Id == query.UserId &&
                x.IsActive)
            .Select(x => new GetPublicProfileResponse
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Username = x.Username,
                ProfileImageUrl = x.ProfileImageUrl,
                IsVerified = x.IsVerified,
                MemberSince = x.CreatedAt,

                AverageRating = _context.SellerReviews
                    .Where(review => review.SellerId == x.Id)
                    .Select(review => (double?)review.Rating)
                    .Average() ?? 0,

                ReviewCount = _context.SellerReviews
                    .Count(review => review.SellerId == x.Id)
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "Seller does not exist.");
        }

        return user;
    }
}
