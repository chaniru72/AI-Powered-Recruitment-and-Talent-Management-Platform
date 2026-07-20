namespace TalentSyncAI.Api.DTOs.AI
{
    public class CandidateMatchResponseDto
    {
        public int ApplicationId { get; set; }

        public int CandidateUserId { get; set; }

        public string CandidateName { get; set; } = string.Empty;

        public string CandidateEmail { get; set; } = string.Empty;

        public int JobId { get; set; }

        public string JobTitle { get; set; } = string.Empty;

        public double MatchScore { get; set; }

        public List<string> MatchedSkills { get; set; } = new();

        public List<string> MissingSkills { get; set; } = new();

        public string Recommendation { get; set; } = string.Empty;
    }
}