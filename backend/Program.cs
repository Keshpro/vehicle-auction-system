var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();
app.UseCors("ReactFrontend");
app.MapControllers();
app.MapGet("/", () => Results.Ok(new { message = "Vehicle Auction API is running" }));
app.Run();
