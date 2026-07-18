namespace TalentSyncAI.Api.DTOs.Recruiters
{
    public class RecruiterProfileResponseDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string JobTitle { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string ProfessionalSummary { get; set; } =
            string.Empty;

        public string? LinkedInUrl { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}