using OC.Bootstrapper.Domain.Identities;

namespace OC.Bootstrapper.Application.Abstractions.Services;

public interface IJwtService {
    string GenerateAccessToken(AppUser user, IList<string> roles, IReadOnlyList<string> permissions);
    string GenerateRefreshToken();
}
