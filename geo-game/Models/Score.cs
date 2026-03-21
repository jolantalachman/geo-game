using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace geo_game.Models
{
    public class Score(int UserId, string GuessedCountries, int GameTime, DateTime GameDate)
    {
        public int Id { get; set; }
        public string GuessedCountries { get; set; } = GuessedCountries;
        public int GameTime { get; set; } = GameTime;
        public DateTime GameDate { get; set; } = GameDate;

        [ForeignKey("UserId")]
        public int UserId { get; set; } = UserId;
        [JsonIgnore]
        public User? User { get; set; }
    }

}
