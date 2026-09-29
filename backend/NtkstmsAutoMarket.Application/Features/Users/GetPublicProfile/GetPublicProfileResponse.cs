namespace NtkstmsAutoMarket.Application.Features.Users.GetPublicProfile;

public class GetPublicProfileResponse
{
    public Guid Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string? ProfileImageUrl { get; set; }

    public bool IsVerified { get; set; }

    public DateTime MemberSince { get; set; }

    public double AverageRating { get; set; }

    public int ReviewCount { get; set; }
}
