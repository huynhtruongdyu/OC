using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace OC.Bootstrapper.API.Transformers;

internal sealed class ApiVersionDocumentTransformer : IOpenApiDocumentTransformer {
    public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken) {
        if (context.DocumentName is { } name) {
            document.Info = new() {
                Title = "OC Bootstrapper API",
                Version = name,
                Description = "OC Bootstrapper API"
            };
        }

        return Task.CompletedTask;
    }
}
