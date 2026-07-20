using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Evaluations
{
    public class EvaluationResponseDto
    {
        public int Id { get; set; }

        public int JobApplicationId { get; set; }

        public int JobId { get; set; }

        public string JobTitle { get; set; }
            = string.Empty;

        public int CandidateUserId { get; set; }

        public string CandidateName { get; set; }
            = string.Empty;

        public string CandidateEmail { get; set; }
            = string.Empty;

        public int TechnicalScore { get; set; }

        public int CommunicationScore { get; set; }

        public int ProblemSolvingScore { get; set; }

        public int CulturalFitScore { get; set; }

        public decimal OverallScore { get; set; }

        public string Strengths { get; set; }
            = string.Empty;

        public string Weaknesses { get; set; }
            = string.Empty;

        public string Comments { get; set; }
            = string.Empty;

        public EvaluationDecision Decision { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}