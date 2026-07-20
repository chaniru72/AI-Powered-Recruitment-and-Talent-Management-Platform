using TalentSyncAI.Api.DTOs.Organizations;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IOrganizationService
    {
        Task<OrganizationResponseDto?>
            GetMyOrganizationAsync(
                int recruiterUserId);

        Task<OrganizationResponseDto>
            CreateOrUpdateMyOrganizationAsync(
                int recruiterUserId,
                UpdateOrganizationDto request);
    }
}