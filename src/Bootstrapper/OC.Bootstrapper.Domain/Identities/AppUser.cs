using Microsoft.AspNetCore.Identity;

namespace OC.Bootstrapper.Domain.Identities;

public class AppUser : IdentityUser<Guid> {
    public string DisplayName { get; set; } = string.Empty;
}
