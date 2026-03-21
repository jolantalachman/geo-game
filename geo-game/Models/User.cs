namespace geo_game.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Role { get; set; }
        public string? Nick {  get; set; }
        public List<Score> Scores { get; set; } = new List<Score>();
    }
}
