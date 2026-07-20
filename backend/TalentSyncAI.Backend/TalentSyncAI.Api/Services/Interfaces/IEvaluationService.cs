using TalentSyncAI.Api.DTOs.Evaluations;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IEvaluationService
    {
        Task<EvaluationResponseDto>
            CreateEvaluationAsync(
                int recruiterUserId,
                CreateEvaluationRequestDto request);

        Task<EvaluationResponseDto?>
            GetEvaluationForApplicationAsync(
                int applicationId,
                int recruiterUserId);

        Task<EvaluationResponseDto?>
            UpdateEvaluationAsync(
                int evaluationId,
                int recruiterUserId,
                UpdateEvaluationRequestDto request);
    }
}