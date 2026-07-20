using System.ComponentModel.DataAnnotations;

namespace TalentSyncAI.Api.DTOs.Organizations
{
    public class UpdateOrganizationDto
    {
        [Required(ErrorMessage =
            "Organization name is required.")]
        [MaxLength(
            200,
            ErrorMessage =
                "Organization name cannot exceed 200 characters.")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(
            150,
            ErrorMessage =
                "Industry cannot exceed 150 characters.")]
        public string Industry { get; set; } = string.Empty;

        [MaxLength(
            3000,
            ErrorMessage =
                "Description cannot exceed 3000 characters.")]
        public string Description { get; set; } =
            string.Empty;

        [MaxLength(
            200,
            ErrorMessage =
                "Location cannot exceed 200 characters.")]
        public string Location { get; set; } = string.Empty;

        [MaxLength(
            500,
            ErrorMessage =
                "Website URL cannot exceed 500 characters.")]
        [Url(ErrorMessage =
            "Enter a valid website URL.")]
        public string? WebsiteUrl { get; set; }
    }
}