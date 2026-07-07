namespace OC.Bootstrapper.API.Extensions;

internal static class CorsExtensions {
    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration) {
        var allowedOrigins = configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
        services.AddCors(options => {
            options.AddDefaultPolicy(policy => {
                policy.WithOrigins(allowedOrigins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        return services;
    }

    public static WebApplication UseCorsPolicy(this WebApplication app) {
        app.UseCors();
        return app;
    }
}
