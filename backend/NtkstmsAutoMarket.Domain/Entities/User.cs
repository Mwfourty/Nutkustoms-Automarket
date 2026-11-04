using NtkstmsAutoMarket.Domain.Common;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Domain.Entities;

public class User : BaseEntity
{
    public string FirstName { get; private set; } = string.Empty;

    public string LastName { get; private set; } = string.Empty;

    public string Username { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public string? PhoneNumber { get; private set; }

    public string? ProfileImageUrl { get; private set; }

    public UserRole Role { get; private set; }

    public bool IsVerified { get; private set; }

    public bool IsActive { get; private set; }

    public string? City { get; private set; }

    public string? Province { get; private set; }

    public DateTime? UsernameChangedAt { get; private set; }

    public DateTime? PasswordChangedAt { get; private set; }

    public ProfileVisibility ProfileVisibility { get; private set; } = ProfileVisibility.Public;

    public bool AllowMessages { get; private set; } = true;

    // Distinguishes a user's own deactivation (reversible by logging in) from an admin action.
    public bool DeactivatedByUser { get; private set; }

    private User()
    {
    }

    public User(
        string firstName,
        string lastName,
        string username,
        string email,
        string passwordHash)
    {
        FirstName = firstName;
        LastName = lastName;
        Username = username;
        Email = email;
        PasswordHash = passwordHash;

        Role = UserRole.User;
        IsVerified = false;
        IsActive = true;
    }

    public void UpdateProfile(
        string firstName,
        string lastName,
        string? phoneNumber,
        string? city,
        string? province)
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;
        City = city;
        Province = province;

        MarkAsUpdated();
    }

    public void ChangeUsername(string username)
    {
        Username = username;
        UsernameChangedAt = DateTime.UtcNow;

        MarkAsUpdated();
    }

    public void UpdateProfileImage(string profileImageUrl)
    {
        ProfileImageUrl = profileImageUrl;

        MarkAsUpdated();
    }

    public void RemoveProfileImage()
    {
        ProfileImageUrl = null;

        MarkAsUpdated();
    }

    public void ChangePassword(string passwordHash)
    {
        PasswordHash = passwordHash;
        PasswordChangedAt = DateTime.UtcNow;

        MarkAsUpdated();
    }

    public void UpdatePrivacy(
        ProfileVisibility visibility,
        bool allowMessages)
    {
        ProfileVisibility = visibility;
        AllowMessages = allowMessages;

        MarkAsUpdated();
    }

    public void DeactivateByUser()
    {
        IsActive = false;
        DeactivatedByUser = true;

        MarkAsUpdated();
    }

    public void Verify()
    {
        IsVerified = true;

        MarkAsUpdated();
    }

    public void Deactivate()
    {
        IsActive = false;

        MarkAsUpdated();
    }

    public void Reactivate()
    {
        IsActive = true;
        DeactivatedByUser = false;

        MarkAsUpdated();
    }
}