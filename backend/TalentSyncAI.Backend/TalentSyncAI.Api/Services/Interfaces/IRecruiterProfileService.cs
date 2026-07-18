using TalentSyncAI.Api.DTOs.Recruiters;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IRecruiterProfileService
    {
        Task<RecruiterProfileResponseDto?>
            GetMyProfileAsync(int userId);

        Task<RecruiterProfileResponseDto>
            CreateOrUpdateMyProfileAsync(
                int userId,
                UpdateRecruiterProfileDto request);
    }
}