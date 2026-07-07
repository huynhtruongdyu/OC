namespace OC.Bootstrapper.Application.DTOs.Catalog;

public sealed record ProductCreateRequest(string Name, string? Description, decimal Price, Guid CategoryId);
