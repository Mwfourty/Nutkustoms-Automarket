using System.Security.Claims;
using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.API.Authentication;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? UserIdOrNull
    {
        get
        {
            var userIdValue = _httpContextAccessor
                .HttpContext?
                .User
                .FindFirstValue(ClaimTypes.NameIdentifier);

            return Guid.TryParse(userIdValue, out var userId)
                ? userId
                : null;
        }
    }

    public Guid UserId
    {
        get
        {
            return UserIdOrNull
                ?? throw new UnauthorizedAccessException(
                    "Authenticated user identifier is missing.");
        }
    }
}
