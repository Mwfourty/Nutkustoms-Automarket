using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}
