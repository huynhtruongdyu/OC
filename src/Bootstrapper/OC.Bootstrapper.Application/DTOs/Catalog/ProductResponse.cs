namespace OC.Bootstrapper.Application.DTOs.Catalog;

public sealed record ProductResponse(Guid Id, string Name, string? Description, decimal Price, Guid CategoryId, string CategoryName);
