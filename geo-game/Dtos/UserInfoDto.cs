namespace geo_game.Dtos
{
    public class UserInfoDto
    {
        public string Email { get; set; }
        public string Role { get; set; }
        public string? Nick { get; set; }
        public int GamesPlayed { get; set; }
        public string AverageScore { get; set; }
        public int AverageTime { get; set; }
    }
}
