using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.Application.Features.Users.GetMyProfile;

public class GetMyProfileResponse
{
    public Guid Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string? ProfileImageUrl { get; set; }

    public UserRole Role { get; set; }

    public bool IsVerified { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public int ListingsSold { get; set; }

    public int CarsInGarage { get; set; }

    public double AverageRating { get; set; }

    public int ReviewCount { get; set; }

    public string? City { get; set; }

    public string? Province { get; set; }

    public ProfileVisibility ProfileVisibility { get; set; }

    public bool AllowMessages { get; set; }

    public DateTime? UsernameChangedAt { get; set; }
}
