using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Applications
{
    public class JobApplicationResponseDto
    {
        public int Id { get; set; }

        public int JobId { get; set; }

        public string JobTitle { get; set; } = string.Empty;

        public int CandidateUserId { get; set; }

        public string CandidateName { get; set; } = string.Empty;

        public string CandidateEmail { get; set; } = string.Empty;

        public string CoverLetter { get; set; } = string.Empty;

        public ApplicationStatus Status { get; set; }

        public DateTime AppliedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}