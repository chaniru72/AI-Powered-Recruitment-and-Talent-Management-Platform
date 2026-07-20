using System.ComponentModel.DataAnnotations;

namespace TalentSyncAI.Api.DTOs.Candidates
{
    public class UploadResumeDto
    {
        [Required(ErrorMessage = "A resume file is required.")]
        public IFormFile? Resume { get; set; }
    }
}