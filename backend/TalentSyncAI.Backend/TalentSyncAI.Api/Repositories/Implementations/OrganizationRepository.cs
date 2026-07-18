using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;

namespace TalentSyncAI.Api.Repositories.Implementations
{
    public class OrganizationRepository
        : IOrganizationRepository
    {
        private readonly ApplicationDbContext _context;

        public OrganizationRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Organization?>
            GetByRecruiterUserIdAsync(
                int recruiterUserId)
        {
            return await _context.Organizations
                .Include(organization =>
                    organization.RecruiterUser)
                .FirstOrDefaultAsync(organization =>
                    organization.RecruiterUserId ==
                    recruiterUserId);
        }

        public async Task AddAsync(
            Organization organization)
        {
            await _context.Organizations
                .AddAsync(organization);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}