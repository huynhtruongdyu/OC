using Microsoft.AspNetCore.Mvc;

using OC.Bootstrapper.Application.Abstractions.Authorization;
using OC.Bootstrapper.Application.Abstractions.Services;
using OC.Bootstrapper.Application.DTOs.Catalog;
using OC.Bootstrapper.Domain.Authorization;

namespace OC.Bootstrapper.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/catalog")]
public sealed class CatalogController(
    IProductService productService,
    ICategoryService categoryService) : ControllerBase {

    [HttpGet("products")]
    [HasPermission(AppPermissions.ProductsView)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductResponse>>>> GetProducts(CancellationToken ct) {
        var products = await productService.GetAllAsync(ct);
        return Ok(ApiResponse.Ok(products));
    }

    [HttpGet("products/{id:guid}")]
    [HasPermission(AppPermissions.ProductsView)]
    public async Task<ActionResult<ApiResponse<ProductResponse>>> GetProduct(Guid id, CancellationToken ct) {
        var product = await productService.GetByIdAsync(id, ct);
        return product is null
            ? NotFound(ApiResponse.Fail<ProductResponse>("Product not found."))
            : Ok(ApiResponse.Ok(product));
    }

    [HttpPost("products")]
    [HasPermission(AppPermissions.ProductsCreate)]
    public async Task<ActionResult<ApiResponse<ProductResponse>>> CreateProduct([FromBody] ProductCreateRequest request, CancellationToken ct) {
        var product = await productService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id, version = "1.0" }, ApiResponse.Ok(product));
    }

    [HttpPut("products/{id:guid}")]
    [HasPermission(AppPermissions.ProductsUpdate)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateProduct(Guid id, [FromBody] ProductUpdateRequest request, CancellationToken ct) {
        await productService.UpdateAsync(id, request, ct);
        return NoContent();
    }

    [HttpDelete("products/{id:guid}")]
    [HasPermission(AppPermissions.ProductsDelete)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProduct(Guid id, CancellationToken ct) {
        await productService.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpGet("categories")]
    [HasPermission(AppPermissions.CategoriesView)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<CategoryResponse>>>> GetCategories(CancellationToken ct) {
        var categories = await categoryService.GetAllAsync(ct);
        return Ok(ApiResponse.Ok(categories));
    }

    [HttpGet("categories/{id:guid}")]
    [HasPermission(AppPermissions.CategoriesView)]
    public async Task<ActionResult<ApiResponse<CategoryResponse>>> GetCategory(Guid id, CancellationToken ct) {
        var category = await categoryService.GetByIdAsync(id, ct);
        return category is null
            ? NotFound(ApiResponse.Fail<CategoryResponse>("Category not found."))
            : Ok(ApiResponse.Ok(category));
    }

    [HttpPost("categories")]
    [HasPermission(AppPermissions.CategoriesCreate)]
    public async Task<ActionResult<ApiResponse<CategoryResponse>>> CreateCategory([FromBody] CategoryCreateRequest request, CancellationToken ct) {
        var category = await categoryService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetCategory), new { id = category.Id, version = "1.0" }, ApiResponse.Ok(category));
    }

    [HttpPut("categories/{id:guid}")]
    [HasPermission(AppPermissions.CategoriesUpdate)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateCategory(Guid id, [FromBody] CategoryUpdateRequest request, CancellationToken ct) {
        await categoryService.UpdateAsync(id, request, ct);
        return NoContent();
    }

    [HttpDelete("categories/{id:guid}")]
    [HasPermission(AppPermissions.CategoriesDelete)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteCategory(Guid id, CancellationToken ct) {
        await categoryService.DeleteAsync(id, ct);
        return NoContent();
    }
}
