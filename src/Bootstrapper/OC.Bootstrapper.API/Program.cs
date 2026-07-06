var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);
builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();
builder.Services.AddVersioning();

var app = builder.Build();

app.UseOpenApiUi();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
