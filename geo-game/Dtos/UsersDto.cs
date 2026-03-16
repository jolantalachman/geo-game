namespace geo_game.Dtos
{
    public class UsersDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }

        public DateTime? LastActivity { get; set; }

    }

    public class PaginatedUsersDto
    {
        public List<UsersDto> Data { get; set; }
        public int TotalCount { get; set; }
    }
}
