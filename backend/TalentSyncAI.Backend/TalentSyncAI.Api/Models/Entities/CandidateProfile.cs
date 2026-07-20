namespace TalentSyncAI.Api.Models.Entities
{
    public class CandidateProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Phone { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string Skills { get; set; } = string.Empty;

        public string Education { get; set; } = string.Empty;

        public string ExperienceSummary { get; set; } = string.Empty;

        public string? ResumeUrl { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
    }
}