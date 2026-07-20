using System.ComponentModel.DataAnnotations;

namespace TalentSyncAI.Api.DTOs.Interviews
{
    public class CreateInterviewRequestDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int JobApplicationId { get; set; }

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
    }
}