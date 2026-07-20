using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.Auth;
using TalentSyncAI.Api.Models.Enums;
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

        [AllowAnonymous]
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

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(
            LoginRequestDto request)
        {
            LoginResult result =
                await _authService.LoginAsync(request);

            if (result.Succeeded)
            {
                return Ok(new
                {
                    message = result.Message,
                    data = result.Data
                });
            }

            if (result.FailureReason ==
                LoginFailureReason.InactiveAccount)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        message = result.Message
                    });
            }

            return Unauthorized(new
            {
                message = result.Message
            });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            string? userId =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            string? fullName =
                User.FindFirstValue(
                    ClaimTypes.Name);

            string? email =
                User.FindFirstValue(
                    ClaimTypes.Email);

            string? role =
                User.FindFirstValue(
                    ClaimTypes.Role);

            return Ok(new
            {
                userId,
                fullName,
                email,
                role
            });
        }

        [Authorize(Roles = nameof(UserRole.Recruiter))]
        [HttpGet("recruiter-only")]
        public IActionResult RecruiterOnly()
        {
            return Ok(new
            {
                message =
                    "You are authorized as a Recruiter."
            });
        }
    }
}