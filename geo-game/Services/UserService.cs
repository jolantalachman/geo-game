using geo_game.Dtos;
using geo_game.Interfaces;
using geo_game.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace geo_game.Services
{
    public delegate void LogAction(string message);
    public class UserService : IUserService
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserService> _logger;

        public event LogAction OnActionLogged;

        public UserService(DatabaseContext context, IConfiguration configuration, ILogger<UserService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            OnActionLogged += LogToConsole;
        }

        public async Task<User> GetOrCreateUserAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                user = new User
                {
                    Email = email,
                    Role = "User"
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                var activity = new Activity(
                    UserId: user.Id,
                    ActivityDateTime: DateTime.UtcNow.AddHours(1),
                    ActivityType: "Registration"
                );
                _context.Activities.Add(activity);
                await _context.SaveChangesAsync();
                OnActionLogged?.Invoke($"Registered user: {user.Email}");
            }
            else
            {
                var activity = new Activity
                (
                    UserId: user.Id,
                    ActivityDateTime: DateTime.UtcNow.AddHours(1),
                    ActivityType: "Login"
                );

                _context.Activities.Add(activity);
                await _context.SaveChangesAsync();
            }

            return user;
        }

        public async Task<string?> GetUserRoleAsync(string? id)
        {
            if(id == null)
            {
                return null;
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }
            return user.Role;
        }

        public async Task<UserInfoDto> GetUserInfoAsync(string? id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }
            var scores = _context.Scores.Where(s => s.UserId == user.Id).ToList();
            var gamesPlayed = scores.Count;
            var averageScore = "0";
            var averageTime = 0.0;

            if (gamesPlayed > 0)
            {

                var guessedCountries = scores
                    .Select(s => s.GuessedCountries)
                    .ToList();

                var int1Values = guessedCountries
                    .Select(s => s.Split('/'))  // Split by '/'
                    .Where(parts => parts.Length > 1 && int.TryParse(parts[0], out _))  // Ensure the array has at least two parts and the first part is an integer
                    .Select(parts => int.Parse(parts[0]))  // Parse the first part as int
                    .ToList();  // Materialize the result

                var int2Values = guessedCountries
                    .Select(s => s.Split('/'))  // Split by '/'
                    .Where(parts => parts.Length > 1 && int.TryParse(parts[1], out _))  // Ensure the array has at least two parts and the second part is an integer
                    .Select(parts => int.Parse(parts[1]))  // Parse the second part as int
                    .ToList();  // Materialize the result

                // Safely calculate average and ensure there's at least one valid value, rounded to 2 decimal places
                var int1Average = int1Values.Any() ? Math.Round(int1Values.Average(), 2).ToString() : "0";
                var int2Average = int2Values.Any() ? Math.Round(int2Values.Average(), 2).ToString() : "0";

                averageScore = $"{int1Average}/{int2Average}";

                averageTime = scores
                    .Select(s => s.GameTime)
                    .Average();
            }

            return new UserInfoDto 
            {
                Email = user.Email,
                Role = user.Role,
                Nick = user.Nick,
                GamesPlayed = gamesPlayed,
                AverageScore = averageScore,
                AverageTime = (int)Math.Round(averageTime),
            };
        }

        public async Task<bool> SaveUserNick(string? id, string nick)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }
            user.Nick = nick;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ScoreChartDto> GetScoreChartDataAsync(string? id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }
            var scores = _context.Scores
                .Where(s => s.UserId == user.Id)
                .OrderBy(s => s.GameDate)
                .ToList();

            var guessedCountries = scores
                .Select(s => s.GuessedCountries)
                .Select(s => s.Split('/'))  // Split by '/'
                .Where(parts => parts.Length > 1 && int.TryParse(parts[0], out _))  // Ensure the array has at least two parts and the first part is an integer
                .Select(parts => int.Parse(parts[0]))  // Parse the first part as int
                .ToList();  // Materialize the result

            var gameDates = scores
                .Select(s => s.GameDate.ToString()) // Assuming GameDate is a DateTime
                .ToList();

            return new ScoreChartDto {
                GuessedCountries = guessedCountries,
                GameDates = gameDates,
            };

        }

        public async Task<bool> DeleteUserScoresAsync(string? id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            var scoresToDelete = _context.Scores.Where(s => s.UserId == user.Id);

            _context.Scores.RemoveRange(scoresToDelete);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteUserAccountAsync(string? id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            var scoresToDelete = _context.Scores.Where(s => s.UserId == user.Id);
            var activityToDelete = _context.Activities.Where(s => s.UserId == user.Id);

            _context.Scores.RemoveRange(scoresToDelete);
            _context.Activities.RemoveRange(activityToDelete);

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<PaginatedScoresDto> GetUserScoresAsync(string? id, int pageIndex, int pageSize, string? sortBy, string? sortDir)
        {
            var user = await _context.Users
                .Include(u => u.Scores)
                .FirstOrDefaultAsync(u => u.Id.ToString() == id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            IQueryable<Score> query = _context.Scores.Where(s => s.UserId == user.Id);

            if (sortDir != null && sortBy != null )
            {
                if (sortBy == "gameDate")
                {
                    query = sortDir == "asc" ? query.OrderBy(s => s.GameDate) : query.OrderByDescending(s => s.GameDate);
                }
                else if (sortBy == "gameTime")
                {
                    query = sortDir == "asc" ? query.OrderBy(s => s.GameTime) : query.OrderByDescending(s => s.GameTime);
                }
                else if (sortBy == "guessedCountries")
                {
                    query = sortDir == "asc" ? query.OrderBy(s => s.GuessedCountries) : query.OrderByDescending(s => s.GuessedCountries);
                }
            }

            var scores = await query
                 .Skip(pageIndex * pageSize)
                 .Take(pageSize)
                 .Select(s => new ScoreDto
                 {
                     GameDate = s.GameDate,
                     GameTime = s.GameTime,
                     GuessedCountries = s.GuessedCountries
                 })
                 .ToListAsync();

            var totalCount = await _context.Scores
            .CountAsync(s => s.UserId == user.Id);


            return new PaginatedScoresDto
            {
                Data = scores,
                TotalCount = totalCount
            };
        }

        public async Task<Score> SaveScoreAsync(string? id, ScoreDto score)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == id);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            var addedScore = new Score(
                UserId: user.Id,
                GuessedCountries: score.GuessedCountries,
                GameTime: score.GameTime,
                GameDate: score.GameDate
            );

            user.Scores.Add(addedScore);

            await _context.SaveChangesAsync();

            OnActionLogged?.Invoke($"Saved score: {addedScore}");

            user = await _context.Users.Include(u => u.Scores).FirstOrDefaultAsync(u => u.Id == user.Id);

            var bestScore = user.Scores
                .Where(score => score.GuessedCountries.Split('/')[0] == user.Scores.Max(s => s.GuessedCountries.Split('/')[0]))
                .FirstOrDefault();

            return bestScore;
        }

        public dynamic JWTGenerator(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Authentication:SecretKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials
                    (
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha512Signature
                  )
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var encryptedToken = tokenHandler.WriteToken(token);
            return new { token = encryptedToken, role = user.Role };

        }

        private void LogToConsole(string message)
        {
            _logger.LogInformation(message);
        }
    }
}