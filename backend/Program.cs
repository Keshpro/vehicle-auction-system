
using VehicleAuction.Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Register Controllers
builder.Services.AddControllers();

// Register Vehicle Repository
builder.Services.AddScoped<VehicleRepository>();

// Configure React Frontend CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Middleware
app.UseCors("ReactFrontend");

// Map API Controllers
app.MapControllers();

// API Health Response
app.MapGet("/", () => Results.Ok(new
{
    message = "Vehicle Auction API is running"
}));

app.Run();
