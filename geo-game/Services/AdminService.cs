using geo_game.Dtos;
using geo_game.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace geo_game.Services
{
    public class AdminService : IAdminService
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _configuration;

        public AdminService(DatabaseContext context, IConfiguration configuration, ILogger<UserService> logger)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<PaginatedActivitiesDto> GetActivityLog(int pageIndex, int pageSize, string? sortBy, string? sortDir)
        {
            IQueryable<ActivityDto> query = _context.Activities
                .Join(_context.Users,
                    activity => activity.UserId,
                    user => user.Id,
                    (activity, user) => new ActivityDto
                    {
                        ActivityDateTime = activity.ActivityDateTime,
                        ActivityType = activity.ActivityType,
                        User = new ActivityUserDto
                        {
                            UserId = activity.UserId,
                            UserEmail = user.Email
                        }
                    });

            // Sorting logic
            if (sortDir != null && sortBy != null)
            {
                // Apply sorting based on the requested sortBy and sortDir
                if (sortBy == "activityDateTime")
                {
                    query = sortDir == "asc" ? query.OrderBy(s => s.ActivityDateTime) : query.OrderByDescending(s => s.ActivityDateTime);
                }
                else if (sortBy == "activityType")
                {
                    query = sortDir == "asc" ? query.OrderBy(s => s.ActivityType) : query.OrderByDescending(s => s.ActivityType);
                }
                else if (sortBy == "user")
                {
                    query = sortDir == "asc" ? query.OrderBy(s => s.User.UserEmail) : query.OrderByDescending(s => s.User.UserEmail);
                }
            }

            // Perform pagination and fetch the results
            var activities = await query
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Get the total count of activities (without pagination)
            var totalCount = await _context.Activities.CountAsync();

            return new PaginatedActivitiesDto
            {
                Data = activities,
                TotalCount = totalCount
            };
        }


        public async Task<PaginatedUsersDto> GetUsers(int pageIndex, int pageSize, string? sortBy, string? sortDir)
        {
            IQueryable<UsersDto> query = _context.Users
                .GroupJoin(_context.Activities,
                    user => user.Id,
                    activity => activity.UserId,
                    (user, activities) => new
                    {
                        user,
                        activities = activities.OrderByDescending(a => a.ActivityDateTime).FirstOrDefault()
                    })
                .Select(result => new UsersDto
                {
                    Id = result.user.Id,
                    Email = result.user.Email,
                    Role = result.user.Role,
                    LastActivity = result.activities != null
                        ? result.activities.ActivityDateTime
                        : null,
                });

            if (sortDir != null && sortBy != null)
            {
                if (sortBy == "email")
                {
                    query = sortDir == "asc" ? query.OrderBy(s => s.Email) : query.OrderByDescending(s => s.Email);
                }
                else if (sortBy == "role")
                {
                    query = sortDir == "asc" ? query.OrderBy(s => s.Role) : query.OrderByDescending(s => s.Role);
                }
                else if (sortBy == "lastActivity")
                {
                    query = sortDir == "asc" ? query.OrderBy(s => s.LastActivity) : query.OrderByDescending(s => s.LastActivity);
                }
            }

            var users = await query
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalCount = await _context.Activities.CountAsync();

            return new PaginatedUsersDto
            {
                Data = users,
                TotalCount = totalCount
            };
        }

        public async Task<bool> DeleteUser(string? id)
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
    }
}