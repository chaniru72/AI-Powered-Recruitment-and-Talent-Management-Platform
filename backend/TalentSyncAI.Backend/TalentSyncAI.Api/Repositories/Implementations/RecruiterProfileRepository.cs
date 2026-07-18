using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;

namespace TalentSyncAI.Api.Repositories.Implementations
{
    public class RecruiterProfileRepository
        : IRecruiterProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public RecruiterProfileRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RecruiterProfile?>
            GetByUserIdAsync(int userId)
        {
            return await _context.RecruiterProfiles
                .Include(profile => profile.User)
                .FirstOrDefaultAsync(
                    profile => profile.UserId == userId);
        }

        public async Task AddAsync(
            RecruiterProfile profile)
        {
            await _context.RecruiterProfiles
                .AddAsync(profile);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}