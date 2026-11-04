using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Infrastructure.Storage;

public class LocalGarageImageStorage : LocalAvatarStorage, IGarageImageStorage
{
    public LocalGarageImageStorage(string root) : base(root)
    {
    }
}
