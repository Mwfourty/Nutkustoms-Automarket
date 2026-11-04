using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Users.UpdateMyProfile;

public class UpdateMyProfileHandler
{
    private const int UsernameCooldownDays = 30;

    private static readonly Regex UsernamePattern =
        new("^[a-z0-9_.]{3,30}$", RegexOptions.Compiled);

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

        var city = NullIfBlank(command.City);
        var province = NullIfBlank(command.Province);

        if (city is { Length: > 100 } || province is { Length: > 100 })
            throw new ArgumentException(
                "City and province cannot exceed 100 characters.");

        var userId = _currentUser.UserId;

        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.Id == userId,
                cancellationToken);

        if (user is null)
            throw new KeyNotFoundException(
                "User does not exist.");

        var username = command.Username?.Trim().ToLowerInvariant();

        if (!string.IsNullOrEmpty(username) &&
            username != user.Username)
        {
            if (!UsernamePattern.IsMatch(username))
                throw new ArgumentException(
                    "Username must be 3-30 characters: letters, numbers, dots or underscores.");

            if (user.UsernameChangedAt is { } changedAt &&
                changedAt.AddDays(UsernameCooldownDays) > DateTime.UtcNow)
            {
                var availableOn = changedAt
                    .AddDays(UsernameCooldownDays)
                    .ToString("dd/MM/yyyy");

                throw new InvalidOperationException(
                    $"You can change your username again on {availableOn}.");
            }

            var taken = await _context.Users
                .AnyAsync(
                    x => x.Username == username && x.Id != userId,
                    cancellationToken);

            if (taken)
                throw new InvalidOperationException(
                    "This username is already taken.");

            user.ChangeUsername(username);
        }

        user.UpdateProfile(
            firstName,
            lastName,
            string.IsNullOrWhiteSpace(phoneNumber)
                ? null
                : phoneNumber,
            city,
            province);

        await _context.SaveChangesAsync(
            cancellationToken);

        return new UpdateMyProfileResult(
            user.Id,
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            user.Username,
            user.City,
            user.Province);
    }

    private static string? NullIfBlank(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}