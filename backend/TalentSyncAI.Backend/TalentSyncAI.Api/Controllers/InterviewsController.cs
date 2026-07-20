using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.Interviews;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/interviews")]
    public class InterviewsController : ControllerBase
    {
        private readonly IInterviewService _interviewService;

        public InterviewsController(
            IInterviewService interviewService)
        {
            _interviewService = interviewService;
        }

        // POST: /api/interviews
        [HttpPost]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<ActionResult<InterviewResponseDto>>
            CreateInterview(
                CreateInterviewRequestDto request)
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
                var interview =
                    await _interviewService
                        .CreateInterviewAsync(
                            recruiterUserId,
                            request);

                return Created(
                    $"/api/interviews/{interview.Id}",
                    interview);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // GET: /api/interviews/my
        [HttpGet("my")]
        [Authorize(Roles = nameof(UserRole.Candidate))]
        public async Task<
            ActionResult<List<InterviewResponseDto>>>
            GetMyInterviews()
        {
            if (!TryGetCurrentUserId(
                    out int candidateUserId))
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid or missing user id in token."
                });
            }

            var interviews =
                await _interviewService
                    .GetMyInterviewsAsync(
                        candidateUserId);

            return Ok(interviews);
        }

        // GET: /api/interviews/applications/1
        [HttpGet("applications/{applicationId:int}")]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<
            ActionResult<List<InterviewResponseDto>>>
            GetInterviewsForApplication(
                int applicationId)
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
                var interviews =
                    await _interviewService
                        .GetInterviewsForApplicationAsync(
                            applicationId,
                            recruiterUserId);

                return Ok(interviews);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
        }

        // PUT: /api/interviews/1
        [HttpPut("{interviewId:int}")]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<ActionResult<InterviewResponseDto>>
            UpdateInterview(
                int interviewId,
                UpdateInterviewRequestDto request)
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
                var interview =
                    await _interviewService
                        .UpdateInterviewAsync(
                            interviewId,
                            recruiterUserId,
                            request);

                if (interview == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Interview not found or you do not have permission to update it."
                    });
                }

                return Ok(interview);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // DELETE: /api/interviews/1
        [HttpDelete("{interviewId:int}")]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<IActionResult>
            DeleteInterview(
                int interviewId)
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

            var deleted =
                await _interviewService
                    .DeleteInterviewAsync(
                        interviewId,
                        recruiterUserId);

            if (!deleted)
            {
                return NotFound(new
                {
                    message =
                        "Interview not found or you do not have permission to delete it."
                });
            }

            return NoContent();
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