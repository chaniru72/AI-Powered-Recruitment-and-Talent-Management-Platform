using TalentSyncAI.Api.Models.Entities;

namespace TalentSyncAI.Api.Repositories.Interfaces
{
    public interface IJobApplicationRepository
    {
        Task<Job?> GetJobByIdAsync(int jobId);

        Task<bool> HasCandidateAppliedAsync(
            int jobId,
            int candidateUserId);

        Task<JobApplication?> GetByIdAsync(
            int applicationId);

        Task<JobApplication?> GetByIdForCandidateAsync(
            int applicationId,
            int candidateUserId);

        Task<JobApplication?> GetByIdForRecruiterAsync(
            int applicationId,
            int recruiterUserId);

        Task<List<JobApplication>> GetApplicationsByCandidateAsync(
            int candidateUserId);

        Task<List<JobApplication>> GetApplicationsByJobForRecruiterAsync(
            int jobId,
            int recruiterUserId);

        Task AddAsync(JobApplication application);

        void Update(JobApplication application);

        Task SaveChangesAsync();
    }
}