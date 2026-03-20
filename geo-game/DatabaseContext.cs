using geo_game.Models;
using Microsoft.EntityFrameworkCore;
    public class DatabaseContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Score> Scores { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

}
