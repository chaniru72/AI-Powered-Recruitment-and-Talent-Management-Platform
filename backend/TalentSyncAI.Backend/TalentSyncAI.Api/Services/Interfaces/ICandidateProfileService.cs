using TalentSyncAI.Api.DTOs.Candidates;
using TalentSyncAI.Api.Helpers;

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

        Task<ResumeUploadResult> UploadResumeAsync(
            int userId,
            IFormFile file,
            CancellationToken cancellationToken = default);

        Task<FileDownloadResult?> GetMyResumeAsync(
            int userId,
            CancellationToken cancellationToken = default);
    }
}