using TalentSyncAI.Api.Models.Entities;

namespace TalentSyncAI.Api.Repositories.Interfaces
{
    public interface IOrganizationRepository
    {
        Task<Organization?> GetByRecruiterUserIdAsync(
            int recruiterUserId);

        Task AddAsync(
            Organization organization);

        Task SaveChangesAsync();
    }
}