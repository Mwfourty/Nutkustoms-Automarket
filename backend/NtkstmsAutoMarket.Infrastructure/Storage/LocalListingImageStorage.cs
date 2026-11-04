using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Infrastructure.Storage;

public class LocalListingImageStorage : LocalAvatarStorage, IListingImageStorage
{
    public LocalListingImageStorage(string root) : base(root)
    {
    }
}
