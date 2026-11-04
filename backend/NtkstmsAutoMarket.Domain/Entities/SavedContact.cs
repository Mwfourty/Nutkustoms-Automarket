using NtkstmsAutoMarket.Domain.Common;

namespace NtkstmsAutoMarket.Domain.Entities;

public class SavedContact : BaseEntity
{
    public Guid UserId { get; private set; }

    public Guid ContactUserId { get; private set; }

    public User User { get; private set; } = null!;

    public User ContactUser { get; private set; } = null!;

    private SavedContact()
    {
    }

    public SavedContact(
        Guid userId,
        Guid contactUserId)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException(
                "User is required.");

        if (contactUserId == Guid.Empty)
            throw new ArgumentException(
                "Contact is required.");

        if (userId == contactUserId)
            throw new ArgumentException(
                "You cannot save yourself as a contact.");

        UserId = userId;
        ContactUserId = contactUserId;
    }
}
