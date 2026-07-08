using Microsoft.AspNetCore.Authorization;

namespace OC.Bootstrapper.Application.Abstractions.Authorization;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
public sealed class HasPermissionAttribute : AuthorizeAttribute {
    public const string PolicyPrefix = "Permission:";

    public string Permission { get; }

    public HasPermissionAttribute(string permission) {
        Permission = permission;
        Policy = $"{PolicyPrefix}{permission}";
    }
}
