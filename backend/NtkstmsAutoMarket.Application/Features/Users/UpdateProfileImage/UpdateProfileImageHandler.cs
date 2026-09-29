using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Users.UpdateProfileImage;

public class UpdateProfileImageHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateProfileImageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UpdateProfileImageResult> Handle(
        UpdateProfileImageCommand command,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(command.ProfileImageUrl))
        {
            throw new ArgumentException(
                "Profile image URL is required.");
        }

        if (command.ProfileImageUrl.Length > 500)
        {
            throw new ArgumentException(
                "Profile image URL cannot exceed 500 characters.");
        }

        var userId = _currentUser.UserId;

        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.Id == userId,
                cancellationToken);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User does not exist.");
        }

        user.UpdateProfileImage(
            command.ProfileImageUrl.Trim());

        await _context.SaveChangesAsync(
            cancellationToken);

        return new UpdateProfileImageResult(
            user.Id,
            user.ProfileImageUrl!);
    }
}
