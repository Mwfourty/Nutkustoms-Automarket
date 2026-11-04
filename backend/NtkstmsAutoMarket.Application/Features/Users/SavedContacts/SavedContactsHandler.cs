using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Users.SavedContacts;

public class SavedContactResponse
{
    public Guid Id { get; set; }

    public string Username { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? ProfileImageUrl { get; set; }

    public bool IsVerified { get; set; }

    public DateTime SavedAt { get; set; }
}

public class SavedContactsHandler
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public SavedContactsHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<SavedContactResponse>> GetAll(
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        return await _context.SavedContacts
            .AsNoTracking()
            .Where(saved =>
                saved.UserId == userId &&
                saved.ContactUser.IsActive)
            .OrderByDescending(saved => saved.CreatedAt)
            .Select(saved => new SavedContactResponse
            {
                Id = saved.ContactUserId,
                Username = saved.ContactUser.Username,
                FirstName = saved.ContactUser.FirstName,
                LastName = saved.ContactUser.LastName,
                ProfileImageUrl = saved.ContactUser.ProfileImageUrl,
                IsVerified = saved.ContactUser.IsVerified,
                SavedAt = saved.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }

    public async Task Add(
        Guid contactUserId,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        if (contactUserId == userId)
        {
            throw new ArgumentException(
                "You cannot save yourself as a contact.");
        }

        var contactExists = await _context.Users
            .AnyAsync(
                x => x.Id == contactUserId && x.IsActive,
                cancellationToken);

        if (!contactExists)
        {
            throw new KeyNotFoundException(
                "User does not exist.");
        }

        var alreadySaved = await _context.SavedContacts
            .AnyAsync(
                x => x.UserId == userId && x.ContactUserId == contactUserId,
                cancellationToken);

        if (alreadySaved)
            return;

        _context.SavedContacts.Add(
            new SavedContact(userId, contactUserId));

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task Remove(
        Guid contactUserId,
        CancellationToken cancellationToken = default)
    {
        var userId = _currentUser.UserId;

        var saved = await _context.SavedContacts
            .FirstOrDefaultAsync(
                x => x.UserId == userId && x.ContactUserId == contactUserId,
                cancellationToken);

        if (saved is null)
            return;

        _context.SavedContacts.Remove(saved);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
