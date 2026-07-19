using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Jobs
{
    public class JobResponseDto
    {
        public int Id { get; set; }

        public int OrganizationId { get; set; }

        public string OrganizationName { get; set; } = string.Empty;

        public int RecruiterUserId { get; set; }

        public string RecruiterName { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string RequiredSkills { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string EmploymentType { get; set; } = string.Empty;

        public string ExperienceLevel { get; set; } = string.Empty;

        public string SalaryRange { get; set; } = string.Empty;

        public JobStatus Status { get; set; }

        public DateTime? ApplicationDeadline { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}