using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

// A JWT that was explicitly ended by logout, kept until it would have expired anyway.
public class RevokedToken : BaseEntity
{
    public string Jti { get; private set; } = string.Empty;

    public Guid UserId { get; private set; }

    public DateTime ExpiresAt { get; private set; }

    private RevokedToken()
    {
    }

    public RevokedToken(
        string jti,
        Guid userId,
        DateTime expiresAt)
    {
        if (string.IsNullOrWhiteSpace(jti))
            throw new ArgumentException(
                "Token identifier is required.");

        Jti = jti;
        UserId = userId;
        ExpiresAt = expiresAt;
    }
}
