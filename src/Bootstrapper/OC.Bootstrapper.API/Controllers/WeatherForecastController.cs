using Microsoft.AspNetCore.Mvc;

namespace OC.Bootstrapper.API.Controllers;

public sealed class WeatherForecastController : PublicController {
    private static readonly string[] Summaries =
    [
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    ];

    [HttpGet(Name = "GetWeatherForecast")]
    public ApiResponse<WeatherForecast[]> Current() {
        var forecasts = Enumerable.Range(1, 5).Select(index => new WeatherForecast {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();

        return ApiResponse.Ok(forecasts, "Current weather forecast retrieved successfully.");
    }

    [HttpGet(Name = "GetSlowWeatherForecast")]
    public async Task<ApiResponse<WeatherForecast[]>> Slow([FromQuery] int delayMs = 5000) {
        await Task.Delay(delayMs);
        var forecasts = Enumerable.Range(1, 5).Select(index => new WeatherForecast {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();

        return ApiResponse.Ok(forecasts, $"Slow weather forecast retrieved after {delayMs}ms.");
    }

    [HttpGet(Name = "GetFailedWeatherForecast")]
    public ApiResponse<WeatherForecast[]> Failed() {
        return ApiResponse.Fail<WeatherForecast[]>(
            "Unable to retrieve weather forecast.",
            new Dictionary<string, string[]> {
                ["date"] = ["The requested date is out of range."],
                ["location"] = ["Location not found.", "Please provide a valid city name."],
            });
    }

    [HttpGet(Name = "GetMockWeatherForecast")]
    public ApiResponse<WeatherForecast[]> Mock() {
        var forecasts = new WeatherForecast[]
        {
            new() { Date = new DateOnly(2026, 7, 8), TemperatureC = 32, Summary = "Hot" },
            new() { Date = new DateOnly(2026, 7, 9), TemperatureC = 28, Summary = "Warm" },
            new() { Date = new DateOnly(2026, 7, 10), TemperatureC = 18, Summary = "Mild" },
            new() { Date = new DateOnly(2026, 7, 11), TemperatureC = 10, Summary = "Cool" },
            new() { Date = new DateOnly(2026, 7, 12), TemperatureC = -1, Summary = "Cold" },
        };

        return ApiResponse.Ok(forecasts, "Mock weather forecast retrieved successfully.");
    }
}
