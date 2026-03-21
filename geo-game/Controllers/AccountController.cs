using Microsoft.AspNetCore.Mvc;
using geo_game.Interfaces;
using Microsoft.AspNetCore.Authorization;
using geo_game.Models;
using Google.Apis.Auth;
using geo_game.Dtos;
using Microsoft.Extensions.Configuration;
namespace geo_game.Controllers

{
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        public AccountController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }


        [HttpGet("Role")]
        public async Task<IActionResult> GetUserRole()
        {
            var userId = HttpContext.User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found.");
            }
            var role = await _userService.GetUserRoleAsync(userId);
            return Ok(new { role= role });
        }

        [HttpGet("UserInfo")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = HttpContext.User.FindFirst("id")?.Value;

            var returnUser = await _userService.GetUserInfoAsync(userId);

            return Ok(returnUser);
        }

        [HttpGet("UserScoreChart")]
        [Authorize]
        public async Task<IActionResult> GetUserScoreChart()
        {
            var userId = HttpContext.User.FindFirst("id")?.Value;

            var returnUser = await _userService.GetScoreChartDataAsync(userId);

            return Ok(returnUser);
        }

        [HttpGet("UserScores")]
        [Authorize]
        public async Task<IActionResult> GetUserScores([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10, [FromQuery] string? sortBy = null, [FromQuery] string? sortDir = null)
        {
            if (pageIndex < 0 || pageSize <= 0)
            {
                return BadRequest("Invalid pageIndex or pageSize.");
            }

            var userId = HttpContext.User.FindFirst("id")?.Value;

            var userScores = await _userService.GetUserScoresAsync(userId, pageIndex, pageSize, sortBy, sortDir);

            return Ok(userScores);
        }

        [HttpDelete("UserScores")]
        [Authorize]
        public async Task<IActionResult> DeleteUserScores()
        {

            var userId = HttpContext.User.FindFirst("id")?.Value;

            var result = await _userService.DeleteUserScoresAsync(userId);

            return Ok();
        }

        [HttpDelete("User")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteUserAccount()
        {

            var userId = HttpContext.User.FindFirst("id")?.Value;

            var result = await _userService.DeleteUserAccountAsync(userId);

            return Ok();
        }

        [HttpPost("SaveScore")]
        [Authorize]
        public async Task<IActionResult> SaveScore([FromBody] ScoreDto scoreRequest)
        {
            var userId = HttpContext.User.FindFirst("id")?.Value;

            var userBestScore = await _userService.SaveScoreAsync(userId, scoreRequest);

            return Ok(userBestScore);
        }

        [HttpPatch("SaveNick")]
        [Authorize]
        public async Task<IActionResult> SaveNick([FromBody] NickRequest nickRequest)
        {
            var userId = HttpContext.User.FindFirst("id")?.Value;

            var result = await _userService.SaveUserNick(userId, nickRequest.Nick);

            return Ok(result);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var idToken = loginRequest.IdToken;

            var clientId = _configuration["Authentication:Google:ClientId"]
                ?? throw new InvalidOperationException("Missing Google ClientId configuration.");

            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string> { clientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            var user = await _userService.GetOrCreateUserAsync(payload.Email);
            return Ok(_userService.JWTGenerator(user));
        }

    }
       
    }

