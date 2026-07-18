using Microsoft.AspNetCore.Mvc;
using TalentSyncAI.Api.DTOs.Auth;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            RegisterRequestDto request)
        {
            RegisterResult result =
                await _authService.RegisterAsync(request);

            if (result.Succeeded)
            {
                return StatusCode(
                    StatusCodes.Status201Created,
                    new
                    {
                        message = result.Message,
                        user = result.User
                    });
            }

            if (result.FailureReason ==
                RegisterFailureReason.EmailAlreadyExists)
            {
                return Conflict(new
                {
                    message = result.Message
                });
            }

            return BadRequest(new
            {
                message = result.Message
            });
        }
    }
}