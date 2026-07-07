using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

using OC.Bootstrapper.Application.Services;
using OC.Bootstrapper.Domain.Identities;
using OC.Bootstrapper.Infrastructure.Persistence;

namespace OC.Bootstrapper.Infrastructure;

public static class InfrastructureRegistration {
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration) {
        services.AddDbContext<AppIdentityDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("Default")));

        services.AddIdentity<AppUser, AppRole>()
            .AddEntityFrameworkStores<AppIdentityDbContext>();

        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

        var jwtOptions = configuration.GetSection("Jwt").Get<JwtOptions>()!;

        services.AddAuthentication(options => {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options => {
            options.TokenValidationParameters = new TokenValidationParameters {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidAudience = jwtOptions.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),
            };
        });

        return services;
    }
}
