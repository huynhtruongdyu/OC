namespace OC.Bootstrapper.API.DTOs.Admin;

public sealed record PermissionGroupResponse(
    string Group,
    IReadOnlyList<string> Permissions
);
