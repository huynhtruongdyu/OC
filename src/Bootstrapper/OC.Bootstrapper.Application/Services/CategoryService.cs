using Microsoft.EntityFrameworkCore;

using OC.Bootstrapper.Application.Abstractions.Repositories;
using OC.Bootstrapper.Application.Abstractions.Services;
using OC.Bootstrapper.Application.DTOs.Catalog;
using OC.Bootstrapper.Domain.Entities;

namespace OC.Bootstrapper.Application.Services;

public sealed class CategoryService(
    IReadRepository<Category> readRepository,
    IUnitOfWork unitOfWork) : ICategoryService {

    public async Task<IReadOnlyList<CategoryResponse>> GetAllAsync(CancellationToken ct = default) {
        var categories = await readRepository.GetAllAsync(ct);
        return categories.Select(Map).ToList();
    }

    public async Task<CategoryResponse?> GetByIdAsync(Guid id, CancellationToken ct = default) {
        var category = await readRepository.GetByIdAsync(id, ct);
        return category is null ? null : Map(category);
    }

    public async Task<CategoryResponse> CreateAsync(CategoryCreateRequest request, CancellationToken ct = default) {
        var category = new Category {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
        };

        await unitOfWork.Repository<Category>().AddAsync(category, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Map(category);
    }

    public async Task UpdateAsync(Guid id, CategoryUpdateRequest request, CancellationToken ct = default) {
        var category = await readRepository.GetByIdAsync(id, ct);
        if (category is null) return;

        category.Name = request.Name;
        category.Description = request.Description;

        await unitOfWork.Repository<Category>().UpdateAsync(category);
        await unitOfWork.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default) {
        var category = await readRepository.GetByIdAsync(id, ct);
        if (category is null) return;

        await unitOfWork.Repository<Category>().DeleteAsync(category);
        await unitOfWork.SaveChangesAsync(ct);
    }

    private static CategoryResponse Map(Category c) => new(c.Id, c.Name, c.Description);
}
