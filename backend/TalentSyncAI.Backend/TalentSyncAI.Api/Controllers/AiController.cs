using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.AI;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [Authorize(Roles = nameof(UserRole.Recruiter))]
    public class AiController : ControllerBase
    {
        private readonly IAiMatchingService _aiMatchingService;

        public AiController(
            IAiMatchingService aiMatchingService)
        {
            _aiMatchingService = aiMatchingService;
        }

        // GET: /api/ai/jobs/1/match-candidates
        [HttpGet("jobs/{jobId:int}/match-candidates")]
        public async Task<
            ActionResult<List<CandidateMatchResponseDto>>>
            GetMatchesForJob(int jobId)
        {
            if (!TryGetCurrentUserId(
                    out int recruiterUserId))
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid or missing user id in token."
                });
            }

            try
            {
                var results =
                    await _aiMatchingService
                        .GetMatchesForJobAsync(
                            jobId,
                            recruiterUserId);

                return Ok(results);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(
                    StatusCodes.Status403Forbidden,
                    new
                    {
                        message = ex.Message
                    });
            }
        }

        private bool TryGetCurrentUserId(
            out int userId)
        {
            userId = 0;

            string? userIdValue =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? User.FindFirstValue("userId")
                ?? User.FindFirstValue("id");

            return int.TryParse(
                userIdValue,
                out userId);
        }
    }
}