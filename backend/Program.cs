using Microsoft.AspNetCore.Authentication.Cookies;
using VehicleAuction.Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Register Controllers
builder.Services.AddControllers();

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
