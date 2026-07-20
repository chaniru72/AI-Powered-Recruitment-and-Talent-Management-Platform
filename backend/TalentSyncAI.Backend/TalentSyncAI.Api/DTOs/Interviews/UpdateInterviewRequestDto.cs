using System.ComponentModel.DataAnnotations;
using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Interviews
{
    public class UpdateInterviewRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public DateTime ScheduledAt { get; set; }

        [Range(15, 480)]
        public int DurationMinutes { get; set; } = 60;

        [MaxLength(500)]
        public string MeetingLink { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        [MaxLength(3000)]
        public string Notes { get; set; } = string.Empty;

        public InterviewStatus Status { get; set; }
            = InterviewStatus.Scheduled;
    }
}