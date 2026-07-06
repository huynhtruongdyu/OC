# Codebase Documentation

## Project Overview

Modular monolith bootstrapper built with **.NET 10**, **ASP.NET Core**, and **Clean Architecture**. Designed to be split into microservices later.

## Technology Stack

| Component | Technology |
|---|---|
| Runtime | .NET 10 |
| Web framework | ASP.NET Core |
| API versioning | Asp.Versioning.Mvc (URL segment) |
| OpenAPI | Microsoft.AspNetCore.OpenApi |
| API docs UI | Scalar |
| Architecture tests | NetArchTest.Rules + xUnit + FluentAssertions |
| Code analysis | SonarAnalyzer + built-in .NET analyzers (all rules, warnings as errors) |

## Project Structure

```
├── Directory.Build.props          # Shared build properties (analyzers, warnings)
├── Directory.Packages.props       # Central NuGet package versions
├── global.json                    # .NET SDK pinning (10.0.301)
├── nuget.config                   # NuGet source (nuget.org)
├── OC.slnx                        # Solution file
│
├── src/
│   ├── Bootstrapper/
│   │   ├── OC.Bootstrapper.API            # Presentation layer
│   │   ├── OC.Bootstrapper.Application    # Use cases layer
│   │   ├── OC.Bootstrapper.Domain         # Domain layer
│   │   ├── OC.Bootstrapper.Infrastructure  # Infrastructure layer
│   │   └── OC.Bootstrapper.Shared         # Shared primitives
│   └── BuildingBlocks/
│       └── OC.BuildingBlocks.SharedKernel # Cross-cutting kernel
│
└── tests/
    └── OC.Architecture.Tests        # Architecture & convention tests
```

## Layer Architecture

```
┌─────────────────────────────────────────┐
│          OC.Bootstrapper.API            │
│         (Presentation Layer)            │
│  Controllers · Middleware · Filters     │
└──────────┬──────────────────────────────┘
           │ depends on
           │
     ┌─────┴─────┐          ┌─────────────┐
     │ Application│          │Infrastructure│
     │ (Use Cases)│          │  (External)  │
     └─────┬─────┘          └─────────────┘
           │ depends on
           │
     ┌─────v──────┐   ┌───────────┐   ┌───────────────┐
     │   Domain   │   │  Shared   │   │  SharedKernel │
     │ (Entities) │   │ (Helpers) │   │(Cross-cutting)│
     └────────────┘   └───────────┘   └───────────────┘
```

### Dependency Rules

All enforced by `LayerDependencyTests` (8 tests):

| Source | Cannot Depend On |
|---|---|
| `Domain` | Application, Infrastructure, API |
| `Application` | Infrastructure, API |
| `Infrastructure` | API |
| `Shared` | Any other Bootstrapper project |
| `SharedKernel` | Any Bootstrapper project |

## API Layer Details

### Controller Hierarchy

```
ControllerBase
  ├── PublicController        [AllowAnonymous]
  │   Route: api/v{version}/public/[controller]/[action]
  │
  ├── InternalController      [Authorize]
  │   Route: api/v{version}/[controller]/[action]
  │   └── WeatherForecastController  (concrete, sealed)
  │
  └── IntegrationController   [Authorize]
      Route: api/v{version}/integration/[controller]/[action]
```

### API Versioning

- Default: `1.0`, URL segment reader (`api/v1/...`)
- Reported in response headers
- Assumes default version when unspecified

### OpenAPI / Scalar

- OpenAPI JSON at `/openapi/{documentName}.json` (dev only)
- Scalar UI at `/scalar/v1` (dev only, opens automatically)
- Custom `ApiVersionDocumentTransformer` sets title/version per document

### Extensions

| File | Methods |
|---|---|
| `OpenApiExtensions.cs` | `AddOpenApiDocument()`, `UseOpenApiUi()` |
| `ApiVersioningExtensions.cs` | `AddVersioning()` |

### Startup (Program.cs)

```csharp
builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();
builder.Services.AddVersioning();

app.UseOpenApiUi();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
```

## Test Suite — OC.Architecture.Tests

### Naming Convention Tests

| Test File | Tests |
|---|---|
| `ControllerNamingTests.cs` | Suffix, abstract base, sealed, inherit ControllerBase |
| `LayerNamingTests.cs` | *Filter, *Extensions, *Transformer suffix, Extensions static |
| `GeneralNamingTests.cs` | Namespace match, sealed internal, non-public in internal folders |

### Architecture Tests

| Test File | Tests |
|---|---|
| `LayerDependencyTests.cs` | 8 layer dependency rules (see table above) |

### Running Tests

```bash
dotnet test tests/OC.Architecture.Tests
```

## Convention Rules

| Rule | Description |
|---|---|
| **Controller** | Concrete controllers end with `Controller`, inherit from base |
| **Filter** | All classes in `Filters/` end with `Filter` |
| **Extensions** | All classes in `Extensions/` end with `Extensions`, are `static` |
| **Transformer** | All classes in `Transformers/` end with `Transformer` |
| **Sealed** | Non-abstract, non-static, non-public classes must be `sealed` |
| **Namespace** | Types must be in their project's root namespace |
| **Internal visibility** | Filters, Extensions, Transformers must not contain public types |

## Configuration Files

| File | Purpose |
|---|---|
| `Directory.Build.props` | Global analyzers, warnings-as-errors, target framework |
| `Directory.Packages.props` | Central package version management |
| `.editorconfig` | Code style rules & diagnostic suppressions |
| `global.json` | SDK version pinning |
| `nuget.config` | Package source configuration |
| `OC.slnx` | Solution file (new XML format) |

## Package Versions (Central)

| Package | Version |
|---|---|
| `Asp.Versioning.Mvc` | 8.* |
| `Asp.Versioning.Mvc.ApiExplorer` | 8.* |
| `Microsoft.AspNetCore.OpenApi` | 10.0.9 |
| `Microsoft.OpenApi` | 2.* |
| `Scalar.AspNetCore` | 2.* |
| `SonarAnalyzer.CSharp` | 10.27.0 |
| `coverlet.collector` | 10.0.1 |
| `Microsoft.NET.Test.Sdk` | 17.* |
| `FluentAssertions` | 7.* |
| `NetArchTest.Rules` | 1.* |
| `xunit` | 2.* |
| `xunit.runner.visualstudio` | 3.* |

## Microservice Migration

This monolith is designed to be split into microservices later. Each Bootstrapper layer becomes a standalone service:

1. Each service keeps its own `API → Application → Domain → Infrastructure` stack
2. `Shared` and `SharedKernel` become shared packages (NuGet/internal feed)
3. Architecture tests are reusable — just add new test classes for each service assembly
4. Communication switches from in-process to gRPC/message queue via Infrastructure layer
