using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace geo_game.Models
{
    public class Activity(int UserId, string ActivityType, DateTime ActivityDateTime)
    {
        public int Id { get; set; }
        public string ActivityType { get; set; } = ActivityType;
        public DateTime ActivityDateTime { get; set; } = ActivityDateTime;

        [ForeignKey("UserId")]
        public int UserId { get; set; } = UserId;
        [JsonIgnore]
        public User? User { get; set; }
    }

}
