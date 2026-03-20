using geo_game;
using geo_game.Interfaces;
using geo_game.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// -------------------------
// DB (safe fallback)
// -------------------------
var connectionString = configuration.GetConnectionString("DefaultConnection");

if (!string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddDbContext<DatabaseContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    // fallback for testing deployments without DB config
    builder.Services.AddDbContext<DatabaseContext>(options =>
        options.UseInMemoryDatabase("DevDb"));
}

// -------------------------
// Logging
// -------------------------
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// -------------------------
// CORS (safe)
// -------------------------
var allowedOrigins =
    configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowUi", policy =>
    {
        if (allowedOrigins.Length == 0)
        {
            // allow everything for testing only
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

// -------------------------
// DI
// -------------------------
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// -------------------------
// JWT (safe optional setup)
// -------------------------
var jwtKey = configuration["Authentication:SecretKey"];

if (!string.IsNullOrWhiteSpace(jwtKey))
{
    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false; // allow local/test deployments
            x.SaveToken = true;

            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey)
                ),
                ValidateIssuer = false,
                ValidateAudience = false,
            };
        });
}
else
{
    // No JWT configured → disable auth pipeline safely
    builder.Services.AddAuthentication();
}

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowUi");

// Only use auth middleware if key exists
if (!string.IsNullOrWhiteSpace(jwtKey))
{
    app.UseAuthentication();
}

app.UseAuthorization();

app.MapControllers();

app.Run();