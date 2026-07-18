using TalentSyncAI.Api.DTOs.Candidates;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface ICandidateProfileService
    {
        Task<CandidateProfileResponseDto?>
            GetMyProfileAsync(int userId);

        Task<CandidateProfileResponseDto>
            CreateOrUpdateMyProfileAsync(
                int userId,
                UpdateCandidateProfileDto request);
    }
}