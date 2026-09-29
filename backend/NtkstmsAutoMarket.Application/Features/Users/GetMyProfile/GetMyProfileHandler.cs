using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Users.GetMyProfile;

public class GetMyProfileHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMyProfileHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetMyProfileResponse> Handle(
        GetMyProfileQuery query,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        var user = await _context.Users
            .AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(x => new GetMyProfileResponse
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Username = x.Username,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber,
                ProfileImageUrl = x.ProfileImageUrl,
                Role = x.Role,
                IsVerified = x.IsVerified,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User does not exist.");
        }

        return user;
    }
}
