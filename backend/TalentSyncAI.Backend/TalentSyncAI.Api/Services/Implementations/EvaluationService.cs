using TalentSyncAI.Api.DTOs.Evaluations;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class EvaluationService
        : IEvaluationService
    {
        private readonly IEvaluationRepository
            _evaluationRepository;

        public EvaluationService(
            IEvaluationRepository evaluationRepository)
        {
            _evaluationRepository =
                evaluationRepository;
        }

        public async Task<EvaluationResponseDto>
            CreateEvaluationAsync(
                int recruiterUserId,
                CreateEvaluationRequestDto request)
        {
            var application =
                await _evaluationRepository
                    .GetApplicationForRecruiterAsync(
                        request.JobApplicationId,
                        recruiterUserId);

            if (application == null)
            {
                throw new KeyNotFoundException(
                    "Application not found or you do not have permission to evaluate it.");
            }

            var existingEvaluation =
                await _evaluationRepository
                    .GetByApplicationForRecruiterAsync(
                        request.JobApplicationId,
                        recruiterUserId);

            if (existingEvaluation != null)
            {
                throw new InvalidOperationException(
                    "An evaluation already exists for this application.");
            }

            var evaluation = new Evaluation
            {
                JobApplicationId =
                    request.JobApplicationId,

                TechnicalScore =
                    request.TechnicalScore,

                CommunicationScore =
                    request.CommunicationScore,

                ProblemSolvingScore =
                    request.ProblemSolvingScore,

                CulturalFitScore =
                    request.CulturalFitScore,

                OverallScore = CalculateOverallScore(
                    request.TechnicalScore,
                    request.CommunicationScore,
                    request.ProblemSolvingScore,
                    request.CulturalFitScore),

                Strengths = request.Strengths,
                Weaknesses = request.Weaknesses,
                Comments = request.Comments,
                Decision = request.Decision,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                JobApplication = application
            };

            await _evaluationRepository
                .AddAsync(evaluation);

            await _evaluationRepository
                .SaveChangesAsync();

            return MapToResponseDto(evaluation);
        }

        public async Task<EvaluationResponseDto?>
            GetEvaluationForApplicationAsync(
                int applicationId,
                int recruiterUserId)
        {
            var evaluation =
                await _evaluationRepository
                    .GetByApplicationForRecruiterAsync(
                        applicationId,
                        recruiterUserId);

            return evaluation == null
                ? null
                : MapToResponseDto(evaluation);
        }

        public async Task<EvaluationResponseDto?>
            UpdateEvaluationAsync(
                int evaluationId,
                int recruiterUserId,
                UpdateEvaluationRequestDto request)
        {
            var evaluation =
                await _evaluationRepository
                    .GetByIdForRecruiterAsync(
                        evaluationId,
                        recruiterUserId);

            if (evaluation == null)
            {
                return null;
            }

            evaluation.TechnicalScore =
                request.TechnicalScore;

            evaluation.CommunicationScore =
                request.CommunicationScore;

            evaluation.ProblemSolvingScore =
                request.ProblemSolvingScore;

            evaluation.CulturalFitScore =
                request.CulturalFitScore;

            evaluation.OverallScore =
                CalculateOverallScore(
                    request.TechnicalScore,
                    request.CommunicationScore,
                    request.ProblemSolvingScore,
                    request.CulturalFitScore);

            evaluation.Strengths =
                request.Strengths;

            evaluation.Weaknesses =
                request.Weaknesses;

            evaluation.Comments =
                request.Comments;

            evaluation.Decision =
                request.Decision;

            evaluation.UpdatedAt =
                DateTime.UtcNow;

            _evaluationRepository.Update(evaluation);

            await _evaluationRepository
                .SaveChangesAsync();

            return MapToResponseDto(evaluation);
        }

        private static decimal CalculateOverallScore(
            int technicalScore,
            int communicationScore,
            int problemSolvingScore,
            int culturalFitScore)
        {
            decimal total =
                technicalScore +
                communicationScore +
                problemSolvingScore +
                culturalFitScore;

            return Math.Round(total / 4m, 2);
        }

        private static EvaluationResponseDto
            MapToResponseDto(
                Evaluation evaluation)
        {
            var application =
                evaluation.JobApplication;

            return new EvaluationResponseDto
            {
                Id = evaluation.Id,

                JobApplicationId =
                    evaluation.JobApplicationId,

                JobId =
                    application?.JobId ?? 0,

                JobTitle =
                    application?.Job?.Title
                    ?? string.Empty,

                CandidateUserId =
                    application?.CandidateUserId ?? 0,

                CandidateName =
                    application?.CandidateUser?.FullName
                    ?? string.Empty,

                CandidateEmail =
                    application?.CandidateUser?.Email
                    ?? string.Empty,

                TechnicalScore =
                    evaluation.TechnicalScore,

                CommunicationScore =
                    evaluation.CommunicationScore,

                ProblemSolvingScore =
                    evaluation.ProblemSolvingScore,

                CulturalFitScore =
                    evaluation.CulturalFitScore,

                OverallScore =
                    evaluation.OverallScore,

                Strengths =
                    evaluation.Strengths,

                Weaknesses =
                    evaluation.Weaknesses,

                Comments =
                    evaluation.Comments,

                Decision =
                    evaluation.Decision,

                CreatedAt =
                    evaluation.CreatedAt,

                UpdatedAt =
                    evaluation.UpdatedAt
            };
        }
    }
}