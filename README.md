# OC

Modular monolith bootstrapper built on .NET 10 with Clean Architecture.

## Prerequisites

- [.NET 10.0 SDK](https://dotnet.microsoft.com/download)

## Quick Start

```bash
dotnet restore
dotnet build
dotnet run --project src/Bootstrapper/OC.Bootstrapper.API
```

Browser opens to Scalar UI at `/scalar/v1` (Development mode).

## Solution Structure

| Layer | Project | Description |
|---|---|---|
| **API** | `OC.Bootstrapper.API` | ASP.NET Core Web API — controllers, middleware |
| **Application** | `OC.Bootstrapper.Application` | Use cases, DTOs, interfaces |
| **Domain** | `OC.Bootstrapper.Domain` | Entities, value objects, domain logic |
| **Infrastructure** | `OC.Bootstrapper.Infrastructure` | External I/O — DB, message queues |
| **Shared** | `OC.Bootstrapper.Shared` | Shared primitives, helpers |
| **Building Blocks** | `OC.BuildingBlocks.SharedKernel` | Cross-cutting shared kernel |
| **Tests** | `OC.Architecture.Tests` | Architecture & naming convention tests |

## Architecture

```
API → Application → Domain ← Infrastructure
       ↘ SharedKernel ↗
```

Dependency rules are enforced by architecture tests (NetArchTest + xUnit).

## Commands

```bash
dotnet build                           # Build all projects
dotnet test                            # Run architecture tests
dotnet run -p src/Bootstrapper/OC.Bootstrapper.API  # Start API
```

See [docs/CODEBASE.md](docs/CODEBASE.md) for detailed documentation.
