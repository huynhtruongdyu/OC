using OC.Bootstrapper.Application.Abstractions.Repositories;
using OC.Bootstrapper.Application.Abstractions.Services;
using OC.Bootstrapper.Application.DTOs.Catalog;
using OC.Bootstrapper.Domain.Entities;

namespace OC.Bootstrapper.Application.Services;

public sealed class ProductService(
    IReadRepository<Product> readRepository,
    IUnitOfWork unitOfWork) : IProductService {

    public async Task<IReadOnlyList<ProductResponse>> GetAllAsync(CancellationToken ct = default) {
        var products = await readRepository.GetAllAsync(p => p.Category);
        var result = new List<ProductResponse>(products.Count);
        foreach (var p in products) result.Add(Map(p));
        return result;
    }

    public async Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken ct = default) {
        var products = await readRepository.GetAsync(p => p.Id == id, p => p.Category);
        return products is [] ? null : Map(products[0]);
    }

    public async Task<ProductResponse> CreateAsync(ProductCreateRequest request, CancellationToken ct = default) {
        var product = new Product {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            CategoryId = request.CategoryId,
        };

        await unitOfWork.Repository<Product>().AddAsync(product, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Map(product);
    }

    public async Task UpdateAsync(Guid id, ProductUpdateRequest request, CancellationToken ct = default) {
        var product = await readRepository.GetByIdAsync(id, ct);
        if (product is null) return;

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.CategoryId = request.CategoryId;

        await unitOfWork.Repository<Product>().UpdateAsync(product);
        await unitOfWork.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default) {
        var product = await readRepository.GetByIdAsync(id, ct);
        if (product is null) return;

        await unitOfWork.Repository<Product>().DeleteAsync(product);
        await unitOfWork.SaveChangesAsync(ct);
    }

    private static ProductResponse Map(Product p) => new(p.Id, p.Name, p.Description, p.Price, p.CategoryId, p.Category?.Name ?? string.Empty);
}
