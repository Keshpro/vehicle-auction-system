
using Microsoft.AspNetCore.Authentication.Cookies;
using VehicleAuction.Api.Repositories;
using VehicleAuction.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// REGISTER CONTROLLERS
// ==========================================

builder.Services.AddControllers();

// ==========================================
// REGISTER REPOSITORIES AND SERVICES
// ==========================================

// Auction Management
builder.Services.AddScoped<AuctionRepository>();
builder.Services.AddScoped<AuctionService>();

// Vehicle Management
builder.Services.AddScoped<VehicleRepository>();
builder.Services.AddScoped<VehiclePhotoRepository>();

// Automated Database Migration
builder.Services.AddScoped<DatabaseMigrationService>();

// ==========================================
// AUTHENTICATION CONFIGURATION
// ==========================================

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

// ==========================================
// REACT FRONTEND CORS
// ==========================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// ==========================================
// BUILD APPLICATION
// ==========================================

var app = builder.Build();

// ==========================================
// AUTOMATED DATABASE MIGRATION
// ==========================================

// Run migrations only in Development and
// only when explicitly enabled for local testing.

if (app.Environment.IsDevelopment() &&
    app.Configuration.GetValue<bool>(
        "DatabaseMigrations:RunOnStartup"))
{
    using var scope = app.Services.CreateScope();

    var migrationService = scope.ServiceProvider
        .GetRequiredService<DatabaseMigrationService>();

    // Step 1: Detect available SQL migration files
    migrationService.CheckMigrationFiles();

    // Step 2: Execute pending SQL migrations
    await migrationService.ApplyMigrationsAsync();

    Console.WriteLine(
        "[SUCCESS] Automatic database migration completed.");
}

// ==========================================
// APPLICATION MIDDLEWARE
// ==========================================

// Enable CORS
app.UseCors("ReactFrontend");

// Enable Authentication
app.UseAuthentication();

// Enable Authorization
app.UseAuthorization();

// ==========================================
// MAP API CONTROLLERS
// ==========================================

app.MapControllers();

// ==========================================
// API HEALTH CHECK
// ==========================================

app.MapGet("/", () => Results.Ok(new
{
    message = "Vehicle Auction API is running"
}));

// ==========================================
// START APPLICATION
// ==========================================

app.Run();
