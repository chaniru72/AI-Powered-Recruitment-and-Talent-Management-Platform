using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using TalentSyncAI.Api.Configuration;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Implementations;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Implementations;
using TalentSyncAI.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add controller support.
// Enums such as Candidate and Recruiter are accepted as text in JSON.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });

// Get the SQL Server connection string.
string connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "DefaultConnection is missing from appsettings.json.");

// Register Entity Framework Core with SQL Server.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// ---------------------------------------------------
// Repository registrations
// ---------------------------------------------------

builder.Services.AddScoped<
    IUserRepository,
    UserRepository>();

builder.Services.AddScoped<
    ICandidateProfileRepository,
    CandidateProfileRepository>();

builder.Services.AddScoped<
    IRecruiterProfileRepository,
    RecruiterProfileRepository>();

// ---------------------------------------------------
// Password hashing
// ---------------------------------------------------

builder.Services.AddScoped<
    IPasswordHasher<User>,
    PasswordHasher<User>>();

// ---------------------------------------------------
// Application service registrations
// ---------------------------------------------------

builder.Services.AddScoped<
    IAuthService,
    AuthService>();

builder.Services.AddScoped<
    ICandidateProfileService,
    CandidateProfileService>();

builder.Services.AddScoped<
    IRecruiterProfileService,
    RecruiterProfileService>();

builder.Services.AddScoped<
    IFileStorageService,
    LocalFileStorageService>();

builder.Services.AddScoped<
    ITokenService,
    TokenService>();

// ---------------------------------------------------
// JWT configuration
// ---------------------------------------------------

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection(
        JwtSettings.SectionName));

JwtSettings jwtSettings =
    builder.Configuration
        .GetSection(JwtSettings.SectionName)
        .Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "JWT configuration is missing.");

if (string.IsNullOrWhiteSpace(jwtSettings.Key))
{
    throw new InvalidOperationException(
        "JWT signing key is missing. Configure it using Manage User Secrets.");
}

// ---------------------------------------------------
// Authentication and authorization
// ---------------------------------------------------

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings.Key)),

                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,

                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero,

                NameClaimType = ClaimTypes.Name,

                RoleClaimType = ClaimTypes.Role
            };
    });

builder.Services.AddAuthorization();

// Build the application.
var app = builder.Build();

// ---------------------------------------------------
// Middleware
// ---------------------------------------------------

app.UseHttpsRedirection();

// Authentication must come before authorization.
app.UseAuthentication();
app.UseAuthorization();

// Activate controller routes.
app.MapControllers();

// ---------------------------------------------------
// General health endpoint
// ---------------------------------------------------

app.MapGet("/health", () =>
{
    return Results.Ok(new
    {
        status = "Healthy",
        service = "TalentSync AI Backend",
        timestamp = DateTime.UtcNow
    });
});

// ---------------------------------------------------
// Database health endpoint
// ---------------------------------------------------

app.MapGet(
    "/health/database",
    async (ApplicationDbContext dbContext) =>
    {
        bool canConnect =
            await dbContext.Database.CanConnectAsync();

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

// Start the backend server.
app.Run();