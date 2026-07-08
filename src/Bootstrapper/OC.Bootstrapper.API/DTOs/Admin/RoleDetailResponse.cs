namespace OC.Bootstrapper.API.DTOs.Admin;

public sealed record RoleDetailResponse(
    Guid Id,
    string Name,
    IReadOnlyList<string> Permissions
);
