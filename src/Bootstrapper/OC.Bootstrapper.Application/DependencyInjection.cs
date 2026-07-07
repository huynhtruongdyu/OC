using Microsoft.Extensions.DependencyInjection;

using OC.Bootstrapper.Application.Abstractions.Services;
using OC.Bootstrapper.Application.Services;

namespace OC.Bootstrapper.Application;

public static class ApplicationRegistration {
    public static IServiceCollection AddApplication(this IServiceCollection services) {
        services.AddScoped<IJwtService, JwtService>();

        return services;
    }
}
