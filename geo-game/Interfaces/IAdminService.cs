using geo_game.Dtos;
using geo_game.Models;

namespace geo_game.Interfaces
{
    public interface IAdminService
    {
        Task<PaginatedActivitiesDto> GetActivityLog(int pageIndex, int pageSize, string? sortBy, string? sortDir);
        Task<PaginatedUsersDto> GetUsers(int pageIndex, int pageSize, string? sortBy, string? sortDir);
        Task<bool> DeleteUser(string? id);
    }
}
