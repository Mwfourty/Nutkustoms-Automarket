namespace NtkstmsAutoMarket.Domain.Enums;

public enum UserRole
{
    User = 1,
    Admin = 2
}

// Kept simple, a user does not need a seperate Buyer, Seller, Dealer role.
// Someone can be both a buy and seller 