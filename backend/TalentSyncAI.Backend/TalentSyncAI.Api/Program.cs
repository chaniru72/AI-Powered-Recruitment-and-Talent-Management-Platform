using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Repositories.Implementations;
using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserRepository, UserRepository>();


var app = builder.Build();


app.UseHttpsRedirection();


app.MapControllers();


app.MapGet("/health", () =>
{
    return Results.Ok(new
    {
        status = "Healthy",
        service = "TalentSync AI Backend",
        timestamp = DateTime.UtcNow
    });
});

app.MapGet("/health/database", async (ApplicationDbContext dbContext) =>
{
    bool canConnect = await dbContext.Database.CanConnectAsync();

    if (!canConnect)
    {
        return Results.StatusCode(
            StatusCodes.Status503ServiceUnavailable);
    }

    return Results.Ok(new
    {
        status = "Healthy",
        database = "AIRecruitmentDB",
        connected = true,
        timestamp = DateTime.UtcNow
    });
});

app.Run();