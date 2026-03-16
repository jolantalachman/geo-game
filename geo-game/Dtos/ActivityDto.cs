namespace geo_game.Dtos
{
    public class ActivityDto
    {
        public string ActivityType { get; set; }
        public DateTime ActivityDateTime { get; set; }

        public ActivityUserDto User { get; set; }

    }

    public class ActivityUserDto
    {
        public int UserId { get; set; }
        public string UserEmail { get; set; }

    }

    public class PaginatedActivitiesDto
    {
        public List<ActivityDto> Data { get; set; }
        public int TotalCount { get; set; }
    }
}
