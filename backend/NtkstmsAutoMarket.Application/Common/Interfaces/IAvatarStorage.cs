namespace NtkstmsAutoMarket.Application.Common.Interfaces;

public record AvatarFile(Stream Content, string ContentType);

public interface IAvatarStorage
{
    Task Save(
        Guid userId,
        byte[] content,
        string contentType,
        CancellationToken cancellationToken = default);

    Task Delete(Guid userId);

    AvatarFile? Open(Guid userId);
}
