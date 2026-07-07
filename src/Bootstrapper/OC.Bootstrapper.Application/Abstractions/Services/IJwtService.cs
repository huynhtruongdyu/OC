using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.Application.Abstractions.Services;

public interface IJwtService {
    string GenerateToken(AppUser user, IList<string> roles);
}
