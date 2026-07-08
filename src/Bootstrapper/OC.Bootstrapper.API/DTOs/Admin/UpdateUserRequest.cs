namespace OC.Bootstrapper.API.DTOs.Admin;

public sealed record UpdateUserRequest(
    string UserName,
    string Email,
    string DisplayName,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string>? Permissions = null
);
