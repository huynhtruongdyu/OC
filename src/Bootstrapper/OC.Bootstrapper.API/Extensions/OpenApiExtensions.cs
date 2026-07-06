namespace OC.Bootstrapper.API.Extensions;

internal static class OpenApiExtensions {
    public static IServiceCollection AddOpenApiDocument(this IServiceCollection services) {
        services.AddOpenApi(options => {
            options.AddDocumentTransformer<ApiVersionDocumentTransformer>();
        });

        return services;
    }

    public static WebApplication UseOpenApiUi(this WebApplication app) {
        if (app.Environment.IsDevelopment()) {
            app.MapOpenApi();
            app.MapScalarApiReference();
        }

        return app;
    }
}
