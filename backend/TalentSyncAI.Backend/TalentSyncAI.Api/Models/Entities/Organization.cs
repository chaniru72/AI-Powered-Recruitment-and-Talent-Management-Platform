namespace TalentSyncAI.Api.Models.Entities
{
    public class Organization
    {
        public int Id { get; set; }

        // The Recruiter account that manages this organization.
        public int RecruiterUserId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Industry { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string? WebsiteUrl { get; set; }

        public DateTime CreatedAt { get; set; } =
            DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } =
            DateTime.UtcNow;

        // Navigation property to the Recruiter User.
        public User RecruiterUser { get; set; } = null!;
    }
}