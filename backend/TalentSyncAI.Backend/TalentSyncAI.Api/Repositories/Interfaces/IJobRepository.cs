using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.Repositories.Interfaces
{
    public interface IJobRepository
    {
        Task<Job?> GetByIdAsync(int jobId);

        Task<Job?> GetByIdForRecruiterAsync(
            int jobId,
            int recruiterUserId);

        Task<List<Job>> GetAllOpenJobsAsync();

        Task<List<Job>> GetJobsByRecruiterAsync(
            int recruiterUserId);

        Task AddAsync(Job job);

        void Update(Job job);

        void Delete(Job job);

        Task<bool> RecruiterHasOrganizationAsync(
            int recruiterUserId);

        Task<int?> GetOrganizationIdByRecruiterAsync(
            int recruiterUserId);

        Task SaveChangesAsync();
    }
}