namespace OC.Bootstrapper.API.DTOs.Auth;

public sealed record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword);
