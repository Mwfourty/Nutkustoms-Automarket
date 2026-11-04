using System.Collections.Concurrent;

namespace NtkstmsAutoMarket.Application.Features.Auth.Login;

/// <summary>
/// Temporarily locks an email after repeated failed logins, which blunts password guessing
/// spread across many IP addresses. State is in memory, so it resets on restart.
/// </summary>
public class LoginAttemptTracker
{
    private const int MaxFailures = 5;
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(15);

    private readonly ConcurrentDictionary<string, (int Failures, DateTime FirstFailure)> _attempts = new();

    public bool IsLockedOut(string email)
    {
        if (!_attempts.TryGetValue(email, out var entry)) return false;

        if (DateTime.UtcNow - entry.FirstFailure > Window)
        {
            _attempts.TryRemove(email, out _);
            return false;
        }

        return entry.Failures >= MaxFailures;
    }

    public void RecordFailure(string email)
    {
        var now = DateTime.UtcNow;

        _attempts.AddOrUpdate(
            email,
            _ => (1, now),
            (_, current) => now - current.FirstFailure > Window
                ? (1, now)
                : (current.Failures + 1, current.FirstFailure));

        // Keep memory bounded under a flood of random emails.
        if (_attempts.Count > 10_000)
        {
            foreach (var key in _attempts
                .Where(x => now - x.Value.FirstFailure > Window)
                .Select(x => x.Key)
                .ToList())
            {
                _attempts.TryRemove(key, out _);
            }
        }
    }

    public void Reset(string email) => _attempts.TryRemove(email, out _);
}
