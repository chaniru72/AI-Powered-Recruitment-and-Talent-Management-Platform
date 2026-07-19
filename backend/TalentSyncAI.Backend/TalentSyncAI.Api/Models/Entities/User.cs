using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.Models.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public UserRole Role { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public CandidateProfile? CandidateProfile { get; set; }

        public RecruiterProfile? RecruiterProfile { get; set; }

        public Organization? ManagedOrganization { get; set; }

        public ICollection<Job> PostedJobs { get; set; } = new List<Job>();
    }
}