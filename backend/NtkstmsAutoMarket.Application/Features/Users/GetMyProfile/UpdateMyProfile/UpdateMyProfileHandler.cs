using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Users.UpdateMyProfile;

public class UpdateMyProfileHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public UpdateMyProfileHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UpdateMyProfileResult> Handle(
        UpdateMyProfileCommand command,
        CancellationToken cancellationToken = default)
    {
        var firstName = command.FirstName.Trim();
        var lastName = command.LastName.Trim();
        var phoneNumber = command.PhoneNumber?.Trim();

        if (string.IsNullOrWhiteSpace(firstName))
            throw new ArgumentException(
                "First name is required.");

        if (string.IsNullOrWhiteSpace(lastName))
            throw new ArgumentException(
                "Last name is required.");

        if (phoneNumber is { Length: > 30 })
            throw new ArgumentException(
                "Phone number cannot exceed 30 characters.");

        var userId = _currentUser.UserId;

        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.Id == userId,
                cancellationToken);

        if (user is null)
            throw new KeyNotFoundException(
                "User does not exist.");

        user.UpdateProfile(
            firstName,
            lastName,
            string.IsNullOrWhiteSpace(phoneNumber)
                ? null
                : phoneNumber);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new UpdateMyProfileResult(
            user.Id,
            user.FirstName,
            user.LastName,
            user.PhoneNumber);
    }
}