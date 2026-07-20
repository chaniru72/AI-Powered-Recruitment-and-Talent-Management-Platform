using TalentSyncAI.Api.Models.Entities;

namespace TalentSyncAI.Api.Repositories.Interfaces
{
    public interface IInterviewRepository
    {
        Task<JobApplication?> GetApplicationForRecruiterAsync(
            int applicationId,
            int recruiterUserId);

        Task<List<Interview>> GetByApplicationForRecruiterAsync(
            int applicationId,
            int recruiterUserId);

        Task<List<Interview>> GetByCandidateAsync(
            int candidateUserId);

        Task<Interview?> GetByIdForRecruiterAsync(
            int interviewId,
            int recruiterUserId);

        Task AddAsync(Interview interview);

        void Update(Interview interview);

        void Delete(Interview interview);

        Task SaveChangesAsync();
    }
}