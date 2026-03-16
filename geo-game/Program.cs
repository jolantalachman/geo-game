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
builder.Services.AddDbContext<DatabaseContext>(options => options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddTransient<DbSeeder>();

builder.Logging.AddConsole();
builder.Logging.AddDebug();

var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new string[0];
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowUi", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAdminService, AdminService>();

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = true;
    x.SaveToken = true;

    var secret = configuration["Authentication:SecretKey"] ?? string.Empty;
    var issuer = configuration["Authentication:Issuer"];
    var audience = configuration["Authentication:Audience"];

    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
        ValidateIssuer = !string.IsNullOrEmpty(issuer),
        ValidIssuer = issuer,
        ValidateAudience = !string.IsNullOrEmpty(audience),
        ValidAudience = audience,
        ValidateLifetime = true
    };
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowUi");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment() || builder.Configuration.GetValue<bool>("ApplyMigrationsAtStartup"))
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
        var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();

        dbContext.Database.Migrate();
        await seeder.SeedAsync();
    }
}

app.Run();
