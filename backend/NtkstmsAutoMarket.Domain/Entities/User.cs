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
        string? phoneNumber)
    {
        FirstName = firstName;
        LastName = lastName;
        PhoneNumber = phoneNumber;

        MarkAsUpdated();
    }

    public void UpdateProfileImage(string profileImageUrl)
    {
        ProfileImageUrl = profileImageUrl;

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

        MarkAsUpdated();
    }
}