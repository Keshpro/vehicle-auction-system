
using Microsoft.AspNetCore.Authentication.Cookies;
using VehicleAuction.Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Register Controllers
builder.Services.AddControllers();

// Register Auction Repository and Service
builder.Services.AddScoped<AuctionRepository>();
builder.Services.AddScoped<VehicleAuction.Api.Services.AuctionService>();

// Authentication for Registration and Login
builder.Services.AddAuthentication(
    CookieAuthenticationDefaults.AuthenticationScheme
)
.AddCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;

    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

builder.Services.AddAuthorization();

// Register Database Migration Service
builder.Services.AddScoped<
    VehicleAuction.Api.Services.DatabaseMigrationService>();

// Register Vehicle Repository
builder.Services.AddScoped<VehicleRepository>();

// Configure React Frontend CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

var app = builder.Build();

// ==========================================
// DATABASE MIGRATION FILE DETECTION TEST
// ==========================================

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();

    var migrationService = scope.ServiceProvider
        .GetRequiredService<
            VehicleAuction.Api.Services.DatabaseMigrationService>();

    // STEP 1: Detect SQL migration files only
    migrationService.CheckMigrationFiles();

    // STEP 2: Automatic migration execution
    // Temporarily disabled during file detection testing
    // await migrationService.ApplyMigrationsAsync();
}

// ==========================================
// APPLICATION MIDDLEWARE
// ==========================================

// Configure CORS
app.UseCors("ReactFrontend");

// Enable Authentication
app.UseAuthentication();

// Enable Authorization
app.UseAuthorization();

// Map API Controllers
app.MapControllers();

// API Health Response
app.MapGet("/", () => Results.Ok(new
{
    message = "Vehicle Auction API is running"
}));

app.Run();
