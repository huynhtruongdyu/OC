namespace OC.Bootstrapper.API.DTOs.Profile;

public sealed record ProfileResponse(
    string UserName,
    string Email,
    string DisplayName,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions);
