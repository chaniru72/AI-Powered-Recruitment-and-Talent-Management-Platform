using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.Models.Entities
{
    public class Evaluation
    {
        public int Id { get; set; }

        public int JobApplicationId { get; set; }

        public int TechnicalScore { get; set; }

        public int CommunicationScore { get; set; }

        public int ProblemSolvingScore { get; set; }

        public int CulturalFitScore { get; set; }

        public decimal OverallScore { get; set; }

        public string Strengths { get; set; } = string.Empty;

        public string Weaknesses { get; set; } = string.Empty;

        public string Comments { get; set; } = string.Empty;

        public EvaluationDecision Decision { get; set; }
            = EvaluationDecision.Pending;

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; }
            = DateTime.UtcNow;

        public JobApplication JobApplication { get; set; }
            = null!;
    }
}