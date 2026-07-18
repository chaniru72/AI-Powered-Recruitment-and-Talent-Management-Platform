using System.ComponentModel.DataAnnotations;

namespace TalentSyncAI.Api.DTOs.Recruiters
{
    public class UpdateRecruiterProfileDto
    {
        [MaxLength(
            20,
            ErrorMessage =
                "Phone number cannot exceed 20 characters.")]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(
            150,
            ErrorMessage =
                "Job title cannot exceed 150 characters.")]
        public string JobTitle { get; set; } = string.Empty;

        [MaxLength(
            150,
            ErrorMessage =
                "Location cannot exceed 150 characters.")]
        public string Location { get; set; } = string.Empty;

        [MaxLength(
            3000,
            ErrorMessage =
                "Professional summary cannot exceed 3000 characters.")]
        public string ProfessionalSummary { get; set; } =
            string.Empty;

        [MaxLength(
            500,
            ErrorMessage =
                "LinkedIn URL cannot exceed 500 characters.")]
        [Url(ErrorMessage =
            "Enter a valid LinkedIn URL.")]
        public string? LinkedInUrl { get; set; }
    }
}