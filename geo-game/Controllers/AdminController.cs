using Microsoft.AspNetCore.Mvc;
using geo_game.Interfaces;
using Microsoft.AspNetCore.Authorization;
namespace geo_game.Controllers
{
    [Route("[controller]")]
    public class AdminController: Controller
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("ActivityLog")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetActivityLog([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10, [FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null)
        {
            if (pageIndex < 0 || pageSize <= 0)
            {
                return BadRequest("Invalid pageIndex or pageSize.");
            }
            var activities = await _adminService.GetActivityLog(pageIndex, pageSize, sortBy, sortDir);
            return Ok(activities);
        }

        [HttpGet("Users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsers([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10, [FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null)
        {
            if (pageIndex < 0 || pageSize <= 0)
            {
                return BadRequest("Invalid pageIndex or pageSize.");
            }
            var users = await _adminService.GetUsers(pageIndex, pageSize, sortBy, sortDir);
            return Ok(users);
        }

        [HttpDelete("User")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser([FromQuery] string? id)
        {
            var result = await _adminService.DeleteUser(id);
            return Ok();
        }
    }
}
