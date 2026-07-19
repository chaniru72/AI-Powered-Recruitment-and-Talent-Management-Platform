using System.ComponentModel.DataAnnotations;

namespace TalentSyncAI.Api.DTOs.Applications
{
    public class ApplyJobRequestDto
    {
        [MaxLength(4000)]
        public string CoverLetter { get; set; } = string.Empty;
    }
}