using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.Models.Entities
{
    public class Job
    {
        public int Id { get; set; }

        public int OrganizationId { get; set; }

        public int RecruiterUserId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string RequiredSkills { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string EmploymentType { get; set; } = string.Empty;

        public string ExperienceLevel { get; set; } = string.Empty;

        public string SalaryRange { get; set; } = string.Empty;

        public JobStatus Status { get; set; } = JobStatus.Open;

        public DateTime? ApplicationDeadline { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Organization Organization { get; set; } = null!;

        public User RecruiterUser { get; set; } = null!;
    }
}