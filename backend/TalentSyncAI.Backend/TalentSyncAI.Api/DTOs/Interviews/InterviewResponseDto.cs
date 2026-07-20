using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Interviews
{
    public class InterviewResponseDto
    {
        public int Id { get; set; }

        public int JobApplicationId { get; set; }

        public int JobId { get; set; }

        public string JobTitle { get; set; } = string.Empty;

        public int CandidateUserId { get; set; }

        public string CandidateName { get; set; } = string.Empty;

        public string CandidateEmail { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public DateTime ScheduledAt { get; set; }

        public int DurationMinutes { get; set; }

        public string MeetingLink { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string Notes { get; set; } = string.Empty;

        public InterviewStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}