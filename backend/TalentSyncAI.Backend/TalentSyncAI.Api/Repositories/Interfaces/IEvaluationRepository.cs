using TalentSyncAI.Api.Models.Entities;

namespace TalentSyncAI.Api.Repositories.Interfaces
{
    public interface IEvaluationRepository
    {
        Task<JobApplication?>
            GetApplicationForRecruiterAsync(
                int applicationId,
                int recruiterUserId);

        Task<Evaluation?>
            GetByApplicationForRecruiterAsync(
                int applicationId,
                int recruiterUserId);

        Task<Evaluation?>
            GetByIdForRecruiterAsync(
                int evaluationId,
                int recruiterUserId);

        Task AddAsync(Evaluation evaluation);

        void Update(Evaluation evaluation);

        Task SaveChangesAsync();
    }
}