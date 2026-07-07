using OC.Bootstrapper.Application.DTOs.Catalog;

namespace OC.Bootstrapper.Application.Abstractions.Services;

public interface ICategoryService {
    Task<IReadOnlyList<CategoryResponse>> GetAllAsync(CancellationToken ct = default);
    Task<CategoryResponse?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<CategoryResponse> CreateAsync(CategoryCreateRequest request, CancellationToken ct = default);
    Task UpdateAsync(Guid id, CategoryUpdateRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
