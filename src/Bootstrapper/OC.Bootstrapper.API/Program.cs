var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);
builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();
builder.Services.AddVersioning();
builder.Services.AddCorsPolicy(configuration);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(configuration);

var app = builder.Build();

app.UseOpenApiUi();
app.UseCorsPolicy();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

await OC.Bootstrapper.Infrastructure.Persistence.Seed.IdentitySeed.SeedAsync(app.Services);

await app.RunAsync();
