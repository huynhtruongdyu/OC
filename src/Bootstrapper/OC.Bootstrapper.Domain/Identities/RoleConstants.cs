namespace OC.Bootstrapper.Domain.Identities;

public static class RoleConstants {
    public const string SystemAdmin = "SystemAdmin";
    public const string Admin = "Admin";
    public const string User = "User";

    public static readonly Guid SystemAdminId = Guid.Parse("B0000000-0000-0000-0000-000000000001");
    public static readonly Guid AdminId = Guid.Parse("B0000000-0000-0000-0000-000000000002");
    public static readonly Guid UserId = Guid.Parse("B0000000-0000-0000-0000-000000000003");


}
