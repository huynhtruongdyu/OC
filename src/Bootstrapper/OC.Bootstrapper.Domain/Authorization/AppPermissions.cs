using System.Collections.Immutable;

namespace OC.Bootstrapper.Domain.Authorization;

public static class AppPermissions {
    public const string ProductsView = "products.view";
    public const string ProductsCreate = "products.create";
    public const string ProductsUpdate = "products.update";
    public const string ProductsDelete = "products.delete";
    public const string ProductsImport = "products.import";
    public const string ProductsExport = "products.export";

    public const string CategoriesView = "categories.view";
    public const string CategoriesCreate = "categories.create";
    public const string CategoriesUpdate = "categories.update";
    public const string CategoriesDelete = "categories.delete";

    public const string UsersView = "users.view";
    public const string UsersCreate = "users.create";
    public const string UsersUpdate = "users.update";
    public const string UsersDelete = "users.delete";

    public const string RolesView = "roles.view";
    public const string RolesCreate = "roles.create";
    public const string RolesUpdate = "roles.update";
    public const string RolesDelete = "roles.delete";

    public const string ClaimType = "permission";

    public static readonly ImmutableDictionary<string, ImmutableArray<string>> Groups = new Dictionary<string, string[]> {
        ["Products"] = [ProductsView, ProductsCreate, ProductsUpdate, ProductsDelete, ProductsImport, ProductsExport],
        ["Categories"] = [CategoriesView, CategoriesCreate, CategoriesUpdate, CategoriesDelete],
        ["Users"] = [UsersView, UsersCreate, UsersUpdate, UsersDelete],
        ["Roles"] = [RolesView, RolesCreate, RolesUpdate, RolesDelete],
    }.ToImmutableDictionary(kv => kv.Key, kv => kv.Value.ToImmutableArray());

    public static readonly ImmutableArray<string> All = Groups.Values.SelectMany(x => x).ToImmutableArray();
}
