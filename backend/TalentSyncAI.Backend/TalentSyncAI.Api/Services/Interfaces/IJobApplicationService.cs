using TalentSyncAI.Api.DTOs.Applications;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IJobApplicationService
    {
        Task<JobApplicationResponseDto> ApplyForJobAsync(
            int jobId,
            int candidateUserId,
            ApplyJobRequestDto request);

        Task<List<JobApplicationResponseDto>> GetMyApplicationsAsync(
            int candidateUserId);

        Task<List<JobApplicationResponseDto>> GetApplicationsForJobAsync(
            int jobId,
            int recruiterUserId);

        Task<JobApplicationResponseDto?> UpdateApplicationStatusAsync(
            int applicationId,
            int recruiterUserId,
            UpdateApplicationStatusRequestDto request);
    }
}