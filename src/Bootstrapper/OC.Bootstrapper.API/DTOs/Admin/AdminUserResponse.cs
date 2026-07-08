namespace OC.Bootstrapper.API.DTOs.Admin;

public sealed record AdminUserResponse(
    Guid Id,
    string UserName,
    string Email,
    string DisplayName,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions,
    bool LockoutEnabled,
    DateTimeOffset? LockoutEnd
);
