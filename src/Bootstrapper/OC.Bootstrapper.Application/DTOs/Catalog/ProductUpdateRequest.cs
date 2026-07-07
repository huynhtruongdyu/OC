namespace OC.Bootstrapper.Application.DTOs.Catalog;

public sealed record ProductUpdateRequest(string Name, string? Description, decimal Price, Guid CategoryId);
