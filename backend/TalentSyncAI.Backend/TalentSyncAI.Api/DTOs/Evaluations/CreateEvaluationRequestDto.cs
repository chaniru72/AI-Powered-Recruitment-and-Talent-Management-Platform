using System.ComponentModel.DataAnnotations;
using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Evaluations
{
    public class CreateEvaluationRequestDto
    {
        [Range(1, int.MaxValue)]
        public int JobApplicationId { get; set; }

        [Range(0, 100)]
        public int TechnicalScore { get; set; }

        [Range(0, 100)]
        public int CommunicationScore { get; set; }

        [Range(0, 100)]
        public int ProblemSolvingScore { get; set; }

        [Range(0, 100)]
        public int CulturalFitScore { get; set; }

        [MaxLength(3000)]
        public string Strengths { get; set; }
            = string.Empty;

        [MaxLength(3000)]
        public string Weaknesses { get; set; }
            = string.Empty;

        [MaxLength(5000)]
        public string Comments { get; set; }
            = string.Empty;

        public EvaluationDecision Decision { get; set; }
            = EvaluationDecision.Pending;
    }
}