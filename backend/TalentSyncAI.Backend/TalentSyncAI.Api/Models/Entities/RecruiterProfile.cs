namespace TalentSyncAI.Api.Models.Entities
{
    public class RecruiterProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Phone { get; set; } = string.Empty;

        public string JobTitle { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string ProfessionalSummary { get; set; } =
            string.Empty;

        public string? LinkedInUrl { get; set; }

        public DateTime UpdatedAt { get; set; } =
            DateTime.UtcNow;

        public User User { get; set; } = null!;
    }
}