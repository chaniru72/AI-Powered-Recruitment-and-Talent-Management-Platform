using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Applications
{
    public class UpdateApplicationStatusRequestDto
    {
        public ApplicationStatus Status { get; set; }
    }
}