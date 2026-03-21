namespace geo_game.Dtos
{
    public class UserInfoDto
    {
        public required string Email { get; set; }
        public required string Role { get; set; }
        public string? Nick { get; set; }
        public int GamesPlayed { get; set; }
        public required string AverageScore { get; set; }
        public int AverageTime { get; set; }
    }
}
