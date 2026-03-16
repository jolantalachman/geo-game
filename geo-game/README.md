# geo-game

This project is an ASP.NET Core Web API.

Local development

1. Copy `appsettings.example.json` to `appsettings.Development.json` and fill the values, or use dotnet user-secrets:

   dotnet user-secrets init
   dotnet user-secrets set "Authentication:SecretKey" "<your-secret>"
   dotnet user-secrets set "Authentication:Google:ClientId" "<client-id>"
   dotnet user-secrets set "Authentication:Google:ClientSecret" "<client-secret>"

2. Run the project:

   dotnet run --project geo-game

CI / GitHub Actions

The workflow `.github/workflows/dotnet.yml` reads repository secrets and exposes them as environment variables during the build.

Required repository secrets:
- AUTH_SECRET
- AUTH_ISSUER
- AUTH_AUDIENCE
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- CORS_ALLOWED_ORIGINS (comma-separated origins)
