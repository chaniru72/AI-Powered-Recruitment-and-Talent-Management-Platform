using TalentSyncAI.Api.DTOs.Jobs;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IJobService
    {
        Task<List<JobResponseDto>> GetAllOpenJobsAsync();

        Task<JobResponseDto?> GetJobByIdAsync(int jobId);

        Task<List<JobResponseDto>> GetMyJobsAsync(
            int recruiterUserId);

        Task<JobResponseDto?> GetMyJobByIdAsync(
            int jobId,
            int recruiterUserId);

        Task<JobResponseDto> CreateJobAsync(
            int recruiterUserId,
            CreateJobRequestDto request);

        Task<JobResponseDto?> UpdateJobAsync(
            int jobId,
            int recruiterUserId,
            UpdateJobRequestDto request);

        Task<bool> DeleteJobAsync(
            int jobId,
            int recruiterUserId);
    }
}