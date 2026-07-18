using TalentSyncAI.Api.Models.Entities;

namespace TalentSyncAI.Api.Repositories.Interfaces
{
    public interface ICandidateProfileRepository
    {
        Task<CandidateProfile?> GetByUserIdAsync(int userId);

        Task AddAsync(CandidateProfile profile);

        Task SaveChangesAsync();
    }
}