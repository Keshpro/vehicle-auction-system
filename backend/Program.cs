using Microsoft.AspNetCore.Authentication.Cookies;
using VehicleAuction.Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Register Controllers
builder.Services.AddControllers();
builder.Services.AddScoped<VehicleAuction.Api.Repositories.AuctionRepository>();
builder.Services.AddScoped<VehicleAuction.Api.Services.AuctionService>();
builder.Services.AddScoped<BidRepository>();
builder.Services.AddScoped<VehicleAuction.Api.Services.BidService>();

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




// Global exception handling
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            var logger = context.RequestServices
                .GetRequiredService<ILogger<Program>>();

            var exceptionFeature =
                context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();

            var exception = exceptionFeature?.Error;

            logger.LogError(
                exception,
                "An unexpected error occurred while processing {Path}",
                context.Request.Path);

            context.Response.StatusCode =
                StatusCodes.Status500InternalServerError;

            context.Response.ContentType = "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                message = "An unexpected server error occurred. Please try again later."
            });
        });
    });
}


// Run database migrations only in Development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();

    var migrationService = scope.ServiceProvider
        .GetRequiredService<
            VehicleAuction.Api.Services.DatabaseMigrationService>();

    await migrationService.ApplyMigrationsAsync();
}

// Middleware
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
