var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);
builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();
builder.Services.AddVersioning();
builder.Services.AddCorsPolicy(configuration);

var app = builder.Build();

app.UseOpenApiUi();
app.UseCorsPolicy();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
