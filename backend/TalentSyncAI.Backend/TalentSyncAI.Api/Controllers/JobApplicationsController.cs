using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.Applications;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/applications")]
    public class JobApplicationsController : ControllerBase
    {
        private readonly IJobApplicationService _applicationService;

        public JobApplicationsController(
            IJobApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        // POST: /api/applications/jobs/1/apply
        [HttpPost("jobs/{jobId:int}/apply")]
        [Authorize(Roles = nameof(UserRole.Candidate))]
        public async Task<ActionResult<JobApplicationResponseDto>> ApplyForJob(
            int jobId,
            ApplyJobRequestDto request)
        {
            if (!TryGetCurrentUserId(out var candidateUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            try
            {
                var application =
                    await _applicationService.ApplyForJobAsync(
                        jobId,
                        candidateUserId,
                        request);

                return CreatedAtAction(
                    nameof(GetMyApplications),
                    new { id = application.Id },
                    application);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // GET: /api/applications/my
        [HttpGet("my")]
        [Authorize(Roles = nameof(UserRole.Candidate))]
        public async Task<ActionResult<List<JobApplicationResponseDto>>> GetMyApplications()
        {
            if (!TryGetCurrentUserId(out var candidateUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var applications =
                await _applicationService.GetMyApplicationsAsync(
                    candidateUserId);

            return Ok(applications);
        }

        // GET: /api/applications/jobs/1
        [HttpGet("jobs/{jobId:int}")]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<ActionResult<List<JobApplicationResponseDto>>> GetApplicationsForJob(
            int jobId)
        {
            if (!TryGetCurrentUserId(out var recruiterUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var applications =
                await _applicationService.GetApplicationsForJobAsync(
                    jobId,
                    recruiterUserId);

            return Ok(applications);
        }

        // PUT: /api/applications/1/status
        [HttpPut("{applicationId:int}/status")]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<ActionResult<JobApplicationResponseDto>> UpdateApplicationStatus(
            int applicationId,
            UpdateApplicationStatusRequestDto request)
        {
            if (!TryGetCurrentUserId(out var recruiterUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var updatedApplication =
                await _applicationService.UpdateApplicationStatusAsync(
                    applicationId,
                    recruiterUserId,
                    request);

            if (updatedApplication == null)
            {
                return NotFound(new
                {
                    message = "Application not found or you do not have permission to update it."
                });
            }

            return Ok(updatedApplication);
        }

        private bool TryGetCurrentUserId(out int userId)
        {
            userId = 0;

            var userIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? User.FindFirstValue("userId")
                ?? User.FindFirstValue("id");

            return int.TryParse(userIdValue, out userId);
        }
    }
}