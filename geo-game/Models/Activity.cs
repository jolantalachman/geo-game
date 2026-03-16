using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace geo_game.Models
{
    public class Activity
    {
        public Activity(int UserId, string ActivityType, DateTime ActivityDateTime)
        {
            this.UserId = UserId;
            this.ActivityType = ActivityType;
            this.ActivityDateTime = ActivityDateTime;
        }
        public int Id { get; set; }
        public string ActivityType { get; set; }
        public DateTime ActivityDateTime { get; set; }

        [ForeignKey("UserId")]
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }

}
