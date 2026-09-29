namespace NtkstmsAutoMarket.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid UserId { get; }

    Guid? UserIdOrNull { get; }
}
