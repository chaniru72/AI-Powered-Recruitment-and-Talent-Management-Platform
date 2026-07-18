namespace TalentSyncAI.Api.DTOs.Organizations
{
    public class OrganizationResponseDto
    {
        public int Id { get; set; }

        public int RecruiterUserId { get; set; }

        public string RecruiterName { get; set; } =
            string.Empty;

        public string RecruiterEmail { get; set; } =
            string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Industry { get; set; } = string.Empty;

        public string Description { get; set; } =
            string.Empty;

        public string Location { get; set; } = string.Empty;

        public string? WebsiteUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}