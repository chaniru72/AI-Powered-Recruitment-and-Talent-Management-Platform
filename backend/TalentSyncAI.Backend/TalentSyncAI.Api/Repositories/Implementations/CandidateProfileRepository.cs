using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;

namespace TalentSyncAI.Api.Repositories.Implementations
{
    public class CandidateProfileRepository
        : ICandidateProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public CandidateProfileRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CandidateProfile?>
            GetByUserIdAsync(int userId)
        {
            return await _context.CandidateProfiles
                .Include(profile => profile.User)
                .FirstOrDefaultAsync(
                    profile => profile.UserId == userId);
        }

        public async Task AddAsync(
            CandidateProfile profile)
        {
            await _context.CandidateProfiles
                .AddAsync(profile);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}