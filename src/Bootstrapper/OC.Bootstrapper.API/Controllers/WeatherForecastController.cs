using Microsoft.AspNetCore.Mvc;

namespace OC.Bootstrapper.API.Controllers;

public sealed class WeatherForecastController : PublicController {
    private static readonly string[] Summaries =
    [
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    ];

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Current() {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }

    [HttpGet(Name = "GetMockWeatherForecast")]
    public IEnumerable<WeatherForecast> Mock() {
        return
        [
            new() { Date = new DateOnly(2026, 7, 8), TemperatureC = 32, Summary = "Hot" },
            new() { Date = new DateOnly(2026, 7, 9), TemperatureC = 28, Summary = "Warm" },
            new() { Date = new DateOnly(2026, 7, 10), TemperatureC = 18, Summary = "Mild" },
            new() { Date = new DateOnly(2026, 7, 11), TemperatureC = 10, Summary = "Cool" },
            new() { Date = new DateOnly(2026, 7, 12), TemperatureC = -1, Summary = "Cold" },
        ];
    }
}
