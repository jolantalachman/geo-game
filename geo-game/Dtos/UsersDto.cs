namespace geo_game.Dtos
{
    public class UsersDto
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Role { get; set; }

        public DateTime? LastActivity { get; set; }

    }

    public class PaginatedUsersDto
    {
        public required List<UsersDto> Data { get; set; }
        public int TotalCount { get; set; }
    }
}
