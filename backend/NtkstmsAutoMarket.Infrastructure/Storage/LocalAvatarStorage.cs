using NtkstmsAutoMarket.Application.Common.Interfaces;

namespace NtkstmsAutoMarket.Infrastructure.Storage;

public class LocalAvatarStorage : IAvatarStorage
{
    private static readonly Dictionary<string, string> Extensions = new()
    {
        ["image/jpeg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp"
    };

    private readonly string _root;

    public LocalAvatarStorage(string root)
    {
        _root = root;
        Directory.CreateDirectory(_root);
    }

    public async Task Save(
        Guid userId,
        byte[] content,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        // Only the userId reaches the file name, so user input can never shape the path.
        await Delete(userId);

        var path = Path.Combine(
            _root,
            $"{userId:N}{Extensions[contentType]}");

        await File.WriteAllBytesAsync(path, content, cancellationToken);
    }

    public Task Delete(Guid userId)
    {
        foreach (var extension in Extensions.Values)
        {
            var path = Path.Combine(_root, $"{userId:N}{extension}");

            if (File.Exists(path))
                File.Delete(path);
        }

        return Task.CompletedTask;
    }

    public AvatarFile? Open(Guid userId)
    {
        foreach (var (contentType, extension) in Extensions)
        {
            var path = Path.Combine(_root, $"{userId:N}{extension}");

            if (File.Exists(path))
                return new AvatarFile(File.OpenRead(path), contentType);
        }

        return null;
    }
}
