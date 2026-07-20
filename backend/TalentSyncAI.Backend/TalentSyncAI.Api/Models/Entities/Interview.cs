using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.Models.Entities
{
    public class Interview
    {
        public int Id { get; set; }

        public int JobApplicationId { get; set; }

        public string Title { get; set; } = string.Empty;

        public DateTime ScheduledAt { get; set; }

        public int DurationMinutes { get; set; } = 60;

        public string MeetingLink { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string Notes { get; set; } = string.Empty;

        public InterviewStatus Status { get; set; }
            = InterviewStatus.Scheduled;

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; }
            = DateTime.UtcNow;

        public JobApplication JobApplication { get; set; }
            = null!;
    }
}