namespace OC.Bootstrapper.API.DTOs.Admin;

public sealed record CreateUserRequest(
    string UserName,
    string Email,
    string DisplayName,
    string Password,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string>? Permissions = null
);
