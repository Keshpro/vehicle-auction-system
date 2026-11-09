# Vehicle Auction & Bidding Management System — ASP.NET Core Backend

Starter ASP.NET Core Web API using C# and .NET 8. No database connection is required yet.

## Requirements
- .NET 8 SDK

## Run
```bash
dotnet restore
dotnet run --launch-profile http
```

Test `http://localhost:5000/api/health` or `http://localhost:5000/`.

## Structure
- Controllers: HTTP endpoints
- Services: business logic
- Repositories: data access
- Models: domain models
- DTOs: request/response objects
- Data: future MySQL connection

## Next steps
Add MySqlConnector, manually authored SQL schema, parameterized queries and feature endpoints. Never commit database passwords.
