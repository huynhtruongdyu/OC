namespace OC.BuildingBlocks.SharedKernel;

public sealed class ApiResponse<T> {
    public bool Success { get; init; }
    public T? Data { get; init; }
    public string? Message { get; init; }
    public IDictionary<string, string[]>? Errors { get; init; }
    public PaginationInfo? Pagination { get; init; }
}

public sealed class PaginationInfo {
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}

public static class ApiResponse {
    public static ApiResponse<T> Ok<T>(T data, string? message = null) => new() {
        Success = true, Data = data, Message = message,
    };

    public static ApiResponse<T> Fail<T>(string message, IDictionary<string, string[]>? errors = null) => new() {
        Success = false, Message = message, Errors = errors,
    };

    public static ApiResponse<IEnumerable<T>> Paginated<T>(
        IEnumerable<T> data, int page, int pageSize, int totalCount, string? message = null) => new() {
        Success = true,
        Data = data,
        Message = message,
        Pagination = new PaginationInfo { Page = page, PageSize = pageSize, TotalCount = totalCount },
    };
}
