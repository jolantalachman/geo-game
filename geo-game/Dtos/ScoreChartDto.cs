using geo_game.Models;

namespace geo_game.Dtos
{
    public class ScoreChartDto
    {
        public List<int> GuessedCountries { get; set; } = new List<int>();
        public List<string> GameDates { get; set; } = new List<string>();
    }

}
