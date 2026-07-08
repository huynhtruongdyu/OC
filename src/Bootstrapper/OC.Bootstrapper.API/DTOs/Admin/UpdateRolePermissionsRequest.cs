namespace OC.Bootstrapper.API.DTOs.Admin;

public sealed record UpdateRolePermissionsRequest(IReadOnlyList<string> Permissions);
