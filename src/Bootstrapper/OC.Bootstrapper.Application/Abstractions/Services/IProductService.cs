using OC.Bootstrapper.Application.DTOs.Catalog;

namespace OC.Bootstrapper.Application.Abstractions.Services;

public interface IProductService {
    Task<IReadOnlyList<ProductResponse>> GetAllAsync(CancellationToken ct = default);
    Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<ProductResponse> CreateAsync(ProductCreateRequest request, CancellationToken ct = default);
    Task UpdateAsync(Guid id, ProductUpdateRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
