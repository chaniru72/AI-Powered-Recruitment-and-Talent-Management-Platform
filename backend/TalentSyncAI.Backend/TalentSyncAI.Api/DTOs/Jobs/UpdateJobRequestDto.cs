using System.ComponentModel.DataAnnotations;
using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Jobs
{
    public class UpdateJobRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(5000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string RequiredSkills { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        [MaxLength(100)]
        public string EmploymentType { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ExperienceLevel { get; set; } = string.Empty;

        [MaxLength(100)]
        public string SalaryRange { get; set; } = string.Empty;

        public JobStatus Status { get; set; } = JobStatus.Open;

        public DateTime? ApplicationDeadline { get; set; }
    }
}