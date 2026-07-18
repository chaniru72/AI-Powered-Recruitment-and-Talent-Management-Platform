using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.Recruiters;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = nameof(UserRole.Recruiter))]
    public class RecruitersController : ControllerBase
    {
        private readonly IRecruiterProfileService
            _profileService;

        public RecruitersController(
            IRecruiterProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            int? userId = GetCurrentUserId();

            if (userId is null)
            {
                return Unauthorized(new
                {
                    message =
                        "The authenticated user ID is missing."
                });
            }

            RecruiterProfileResponseDto? profile =
                await _profileService
                    .GetMyProfileAsync(userId.Value);

            if (profile is null)
            {
                return NotFound(new
                {
                    message =
                        "Recruiter profile has not been created."
                });
            }

            return Ok(profile);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile(
            UpdateRecruiterProfileDto request)
        {
            int? userId = GetCurrentUserId();

            if (userId is null)
            {
                return Unauthorized(new
                {
                    message =
                        "The authenticated user ID is missing."
                });
            }

            RecruiterProfileResponseDto profile =
                await _profileService
                    .CreateOrUpdateMyProfileAsync(
                        userId.Value,
                        request);

            return Ok(new
            {
                message =
                    "Recruiter profile saved successfully.",
                profile
            });
        }

        private int? GetCurrentUserId()
        {
            string? userIdValue =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!int.TryParse(
                    userIdValue,
                    out int userId))
            {
                return null;
            }

            return userId;
        }
    }
}