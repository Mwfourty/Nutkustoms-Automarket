using Microsoft.Extensions.DependencyInjection;

namespace NtkstmsAutoMarket.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services)
    {
        services.AddScoped<
            Features.Listings.CreateListing.CreateListingHandler>();

        return services;
    }
}