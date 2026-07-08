using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.Application.Abstractions.Services;

public interface IPermissionService {
    Task<IReadOnlyList<string>> GetUserPermissionsAsync(AppUser user);
}
