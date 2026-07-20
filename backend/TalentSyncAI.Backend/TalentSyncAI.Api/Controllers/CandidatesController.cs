using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.Candidates;
using TalentSyncAI.Api.Helpers;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = nameof(UserRole.Candidate))]
    public class CandidatesController : ControllerBase
    {
        private readonly ICandidateProfileService _profileService;

        public CandidatesController(
            ICandidateProfileService profileService)
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

            CandidateProfileResponseDto? profile =
                await _profileService.GetMyProfileAsync(
                    userId.Value);

            if (profile is null)
            {
                return NotFound(new
                {
                    message =
                        "Candidate profile has not been created."
                });
            }

            return Ok(profile);
        }

        
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile(
            UpdateCandidateProfileDto request)
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

            CandidateProfileResponseDto profile =
                await _profileService
                    .CreateOrUpdateMyProfileAsync(
                        userId.Value,
                        request);

            return Ok(new
            {
                message =
                    "Candidate profile saved successfully.",
                profile
            });
        }

       
        [HttpPost("me/resume")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(6 * 1024 * 1024)]
        public async Task<IActionResult> UploadResume(
            [FromForm] UploadResumeDto request,
            CancellationToken cancellationToken)
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

            if (request.Resume is null)
            {
                return BadRequest(new
                {
                    message =
                        "A resume file is required."
                });
            }

            ResumeUploadResult result =
                await _profileService.UploadResumeAsync(
                    userId.Value,
                    request.Resume,
                    cancellationToken);

            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                data = result.Data
            });
        }

        
        [HttpGet("me/resume")]
        public async Task<IActionResult> DownloadResume(
            CancellationToken cancellationToken)
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

            FileDownloadResult? result =
                await _profileService.GetMyResumeAsync(
                    userId.Value,
                    cancellationToken);

            if (result is null)
            {
                return NotFound(new
                {
                    message =
                        "No resume has been uploaded."
                });
            }

            return File(
                result.FileStream,
                result.ContentType,
                result.DownloadFileName,
                enableRangeProcessing: true);
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