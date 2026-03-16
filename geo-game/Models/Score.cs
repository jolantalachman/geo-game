using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace geo_game.Models
{
    public class Score
    {
        public Score(int UserId, string GuessedCountries, int GameTime, DateTime GameDate)
        {
            this.UserId = UserId;
            this.GuessedCountries = GuessedCountries;
            this.GameTime = GameTime;
            this.GameDate = GameDate;
        }

        public int Id { get; set; }
        public string GuessedCountries { get; set; }
        public int GameTime { get; set; }
        public DateTime GameDate { get; set; }

        [ForeignKey("UserId")]
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }

}
