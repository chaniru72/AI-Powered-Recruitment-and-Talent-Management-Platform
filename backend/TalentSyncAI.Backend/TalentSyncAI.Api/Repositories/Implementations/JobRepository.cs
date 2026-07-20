using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Repositories.Interfaces;

namespace TalentSyncAI.Api.Repositories.Implementations
{
    public class JobRepository : IJobRepository
    {
        private readonly ApplicationDbContext _context;

        public JobRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Job?> GetByIdAsync(int jobId)
        {
            return await _context.Jobs
                .Include(job => job.Organization)
                .Include(job => job.RecruiterUser)
                .FirstOrDefaultAsync(job => job.Id == jobId);
        }

        public async Task<Job?> GetByIdForRecruiterAsync(
            int jobId,
            int recruiterUserId)
        {
            return await _context.Jobs
                .Include(job => job.Organization)
                .Include(job => job.RecruiterUser)
                .FirstOrDefaultAsync(job =>
                    job.Id == jobId &&
                    job.RecruiterUserId == recruiterUserId);
        }

        public async Task<List<Job>> GetAllOpenJobsAsync()
        {
            return await _context.Jobs
                .Include(job => job.Organization)
                .Include(job => job.RecruiterUser)
                .Where(job => job.Status == JobStatus.Open)
                .OrderByDescending(job => job.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Job>> GetJobsByRecruiterAsync(
            int recruiterUserId)
        {
            return await _context.Jobs
                .Include(job => job.Organization)
                .Include(job => job.RecruiterUser)
                .Where(job => job.RecruiterUserId == recruiterUserId)
                .OrderByDescending(job => job.CreatedAt)
                .ToListAsync();
        }

        public async Task AddAsync(Job job)
        {
            await _context.Jobs.AddAsync(job);
        }

        public void Update(Job job)
        {
            _context.Jobs.Update(job);
        }

        public void Delete(Job job)
        {
            _context.Jobs.Remove(job);
        }

        public async Task<bool> RecruiterHasOrganizationAsync(
            int recruiterUserId)
        {
            return await _context.Organizations
                .AnyAsync(organization =>
                    organization.RecruiterUserId == recruiterUserId);
        }

        public async Task<int?> GetOrganizationIdByRecruiterAsync(
            int recruiterUserId)
        {
            return await _context.Organizations
                .Where(organization =>
                    organization.RecruiterUserId == recruiterUserId)
                .Select(organization => (int?)organization.Id)
                .FirstOrDefaultAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}