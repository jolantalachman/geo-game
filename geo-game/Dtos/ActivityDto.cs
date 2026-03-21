namespace geo_game.Dtos
{
    public class ActivityDto
    {
        public required string ActivityType { get; set; }
        public DateTime ActivityDateTime { get; set; }

        public required ActivityUserDto User { get; set; }

    }

    public class ActivityUserDto
    {
        public int UserId { get; set; }
        public required string UserEmail { get; set; }

    }

    public class PaginatedActivitiesDto
    {
        public required List<ActivityDto> Data { get; set; }
        public int TotalCount { get; set; }
    }
}
