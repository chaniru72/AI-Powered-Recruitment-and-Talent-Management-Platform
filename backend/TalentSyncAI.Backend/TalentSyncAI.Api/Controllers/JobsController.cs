using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.Jobs;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        // GET: /api/jobs
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<JobResponseDto>>> GetOpenJobs()
        {
            var jobs = await _jobService.GetAllOpenJobsAsync();

            return Ok(jobs);
        }

        // GET: /api/jobs/1
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<JobResponseDto>> GetJobById(int id)
        {
            var job = await _jobService.GetJobByIdAsync(id);

            if (job == null)
            {
                return NotFound(new
                {
                    message = "Job not found."
                });
            }

            return Ok(job);
        }

        // GET: /api/jobs/my
        [HttpGet("my")]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<ActionResult<List<JobResponseDto>>> GetMyJobs()
        {
            if (!TryGetCurrentUserId(out var recruiterUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var jobs = await _jobService.GetMyJobsAsync(recruiterUserId);

            return Ok(jobs);
        }

        // GET: /api/jobs/my/1
        [HttpGet("my/{id:int}")]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<ActionResult<JobResponseDto>> GetMyJobById(int id)
        {
            if (!TryGetCurrentUserId(out var recruiterUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var job = await _jobService.GetMyJobByIdAsync(
                id,
                recruiterUserId);

            if (job == null)
            {
                return NotFound(new
                {
                    message = "Job not found or you do not own this job."
                });
            }

            return Ok(job);
        }

        // POST: /api/jobs
        [HttpPost]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<ActionResult<JobResponseDto>> CreateJob(
            CreateJobRequestDto request)
        {
            if (!TryGetCurrentUserId(out var recruiterUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            try
            {
                var createdJob = await _jobService.CreateJobAsync(
                    recruiterUserId,
                    request);

                return CreatedAtAction(
                    nameof(GetJobById),
                    new { id = createdJob.Id },
                    createdJob);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // PUT: /api/jobs/1
        [HttpPut("{id:int}")]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<ActionResult<JobResponseDto>> UpdateJob(
            int id,
            UpdateJobRequestDto request)
        {
            if (!TryGetCurrentUserId(out var recruiterUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var updatedJob = await _jobService.UpdateJobAsync(
                id,
                recruiterUserId,
                request);

            if (updatedJob == null)
            {
                return NotFound(new
                {
                    message = "Job not found or you do not own this job."
                });
            }

            return Ok(updatedJob);
        }

        // DELETE: /api/jobs/1
        [HttpDelete("{id:int}")]
        [Authorize(Roles = nameof(UserRole.Recruiter))]
        public async Task<IActionResult> DeleteJob(int id)
        {
            if (!TryGetCurrentUserId(out var recruiterUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var deleted = await _jobService.DeleteJobAsync(
                id,
                recruiterUserId);

            if (!deleted)
            {
                return NotFound(new
                {
                    message = "Job not found or you do not own this job."
                });
            }

            return NoContent();
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