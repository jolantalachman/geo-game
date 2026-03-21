namespace geo_game.Dtos
{
    public class ScoreDto
    {
        public required string GuessedCountries { get; set; }
        public int GameTime { get; set; }
        public DateTime GameDate { get; set; }
    }

}
