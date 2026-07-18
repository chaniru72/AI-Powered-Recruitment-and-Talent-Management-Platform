var builder = WebApplication.CreateBuilder(args);

// Adds support for controller-based API endpoints.
builder.Services.AddControllers();

// Builds the application using the registered services.
var app = builder.Build();

// Redirects normal HTTP requests to secure HTTPS.
app.UseHttpsRedirection();

// Finds and activates controllers inside the Controllers folder.
app.MapControllers();

// A temporary endpoint used to verify that the backend is running.
app.MapGet("/health", () =>
{
    return Results.Ok(new
    {
        status = "Healthy",
        service = "TalentSync AI Backend",
        timestamp = DateTime.UtcNow
    });
});

// Starts the backend web server.
app.Run();