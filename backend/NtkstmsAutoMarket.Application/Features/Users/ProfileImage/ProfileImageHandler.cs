using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Application.Features.Users.ProfileImage;

public class ProfileImageHandler
{
    public const int MaxBytes = 2 * 1024 * 1024;

    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IAvatarStorage _storage;

    public ProfileImageHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IAvatarStorage storage)
    {
        _context = context;
        _currentUser = currentUser;
        _storage = storage;
    }

    public async Task<string> Upload(
        byte[] content,
        CancellationToken cancellationToken = default)
    {
        if (content.Length == 0)
            throw new ArgumentException("No image was uploaded.");

        if (content.Length > MaxBytes)
            throw new ArgumentException("Image must be 2 MB or smaller.");

        // The declared content type is client-controlled, so detect the type from the file itself.
        var contentType = Detect(content)
            ?? throw new ArgumentException(
                "Only JPEG, PNG or WebP images are allowed.");

        var userId = _currentUser.UserId;

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken)
            ?? throw new KeyNotFoundException("User does not exist.");

        await _storage.Save(userId, content, contentType, cancellationToken);

        // The version suffix busts browser caches when the picture changes.
        var url =
            $"/api/Users/{userId}/avatar?v={DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

        user.UpdateProfileImage(url);

        await _context.SaveChangesAsync(cancellationToken);

        return url;
    }

    public async Task Remove(
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken)
            ?? throw new KeyNotFoundException("User does not exist.");

        await _storage.Delete(userId);

        user.RemoveProfileImage();

        await _context.SaveChangesAsync(cancellationToken);
    }

    public static string? Detect(byte[] b)
    {
        if (b.Length >= 3 && b[0] == 0xFF && b[1] == 0xD8 && b[2] == 0xFF)
            return "image/jpeg";

        if (b.Length >= 8 && b[0] == 0x89 && b[1] == 0x50 &&
            b[2] == 0x4E && b[3] == 0x47)
            return "image/png";

        if (b.Length >= 12 &&
            b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F' &&
            b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P')
            return "image/webp";

        return null;
    }
}
