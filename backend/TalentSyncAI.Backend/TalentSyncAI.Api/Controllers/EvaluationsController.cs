using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.Evaluations;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/evaluations")]
    [Authorize(Roles = nameof(UserRole.Recruiter))]
    public class EvaluationsController : ControllerBase
    {
        private readonly IEvaluationService
            _evaluationService;

        public EvaluationsController(
            IEvaluationService evaluationService)
        {
            _evaluationService = evaluationService;
        }

        // POST: /api/evaluations
        [HttpPost]
        public async Task<
            ActionResult<EvaluationResponseDto>>
            CreateEvaluation(
                CreateEvaluationRequestDto request)
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
                var evaluation =
                    await _evaluationService
                        .CreateEvaluationAsync(
                            recruiterUserId,
                            request);

                return Created(
                    $"/api/evaluations/{evaluation.Id}",
                    evaluation);
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
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

        // GET: /api/evaluations/applications/1
        [HttpGet("applications/{applicationId:int}")]
        public async Task<
            ActionResult<EvaluationResponseDto>>
            GetEvaluationForApplication(
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

            var evaluation =
                await _evaluationService
                    .GetEvaluationForApplicationAsync(
                        applicationId,
                        recruiterUserId);

            if (evaluation == null)
            {
                return NotFound(new
                {
                    message =
                        "Evaluation not found or you do not have permission to view it."
                });
            }

            return Ok(evaluation);
        }

        // PUT: /api/evaluations/1
        [HttpPut("{evaluationId:int}")]
        public async Task<
            ActionResult<EvaluationResponseDto>>
            UpdateEvaluation(
                int evaluationId,
                UpdateEvaluationRequestDto request)
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

            var evaluation =
                await _evaluationService
                    .UpdateEvaluationAsync(
                        evaluationId,
                        recruiterUserId,
                        request);

            if (evaluation == null)
            {
                return NotFound(new
                {
                    message =
                        "Evaluation not found or you do not have permission to update it."
                });
            }

            return Ok(evaluation);
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