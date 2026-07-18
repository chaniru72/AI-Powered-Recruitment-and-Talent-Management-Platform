using TalentSyncAI.Api.Models.Entities;

namespace TalentSyncAI.Api.Repositories.Interfaces
{
    public interface IRecruiterProfileRepository
    {
        Task<RecruiterProfile?> GetByUserIdAsync(
            int userId);

        Task AddAsync(
            RecruiterProfile profile);

        Task SaveChangesAsync();
    }
}