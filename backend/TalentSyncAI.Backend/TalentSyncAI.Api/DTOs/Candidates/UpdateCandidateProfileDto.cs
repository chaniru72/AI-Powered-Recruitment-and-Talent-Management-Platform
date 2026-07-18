using System.ComponentModel.DataAnnotations;

namespace TalentSyncAI.Api.DTOs.Candidates
{
    public class UpdateCandidateProfileDto
    {
        [MaxLength(20, ErrorMessage =
            "Phone number cannot exceed 20 characters.")]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(150, ErrorMessage =
            "Location cannot exceed 150 characters.")]
        public string Location { get; set; } = string.Empty;

        [MaxLength(2000, ErrorMessage =
            "Skills cannot exceed 2000 characters.")]
        public string Skills { get; set; } = string.Empty;

        [MaxLength(2000, ErrorMessage =
            "Education cannot exceed 2000 characters.")]
        public string Education { get; set; } = string.Empty;

        [MaxLength(4000, ErrorMessage =
            "Experience summary cannot exceed 4000 characters.")]
        public string ExperienceSummary { get; set; } =
            string.Empty;
    }
}