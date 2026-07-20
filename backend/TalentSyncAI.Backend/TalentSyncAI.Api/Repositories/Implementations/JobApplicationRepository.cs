using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;

namespace TalentSyncAI.Api.Repositories.Implementations
{
    public class JobApplicationRepository : IJobApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Job?> GetJobByIdAsync(int jobId)
        {
            return await _context.Jobs
                .Include(job => job.Organization)
                .Include(job => job.RecruiterUser)
                .FirstOrDefaultAsync(job => job.Id == jobId);
        }

        public async Task<bool> HasCandidateAppliedAsync(
            int jobId,
            int candidateUserId)
        {
            return await _context.JobApplications
                .AnyAsync(application =>
                    application.JobId == jobId &&
                    application.CandidateUserId == candidateUserId);
        }

        public async Task<JobApplication?> GetByIdAsync(
            int applicationId)
        {
            return await _context.JobApplications
                .Include(application => application.Job)
                .Include(application => application.CandidateUser)
                .FirstOrDefaultAsync(application =>
                    application.Id == applicationId);
        }

        public async Task<JobApplication?> GetByIdForCandidateAsync(
            int applicationId,
            int candidateUserId)
        {
            return await _context.JobApplications
                .Include(application => application.Job)
                .Include(application => application.CandidateUser)
                .FirstOrDefaultAsync(application =>
                    application.Id == applicationId &&
                    application.CandidateUserId == candidateUserId);
        }

        public async Task<JobApplication?> GetByIdForRecruiterAsync(
            int applicationId,
            int recruiterUserId)
        {
            return await _context.JobApplications
                .Include(application => application.Job)
                .Include(application => application.CandidateUser)
                .FirstOrDefaultAsync(application =>
                    application.Id == applicationId &&
                    application.Job.RecruiterUserId == recruiterUserId);
        }

        public async Task<List<JobApplication>> GetApplicationsByCandidateAsync(
            int candidateUserId)
        {
            return await _context.JobApplications
                .Include(application => application.Job)
                .Include(application => application.CandidateUser)
                .Where(application =>
                    application.CandidateUserId == candidateUserId)
                .OrderByDescending(application => application.AppliedAt)
                .ToListAsync();
        }

        public async Task<List<JobApplication>> GetApplicationsByJobForRecruiterAsync(
            int jobId,
            int recruiterUserId)
        {
            return await _context.JobApplications
                .Include(application => application.Job)
                .Include(application => application.CandidateUser)
                .Where(application =>
                    application.JobId == jobId &&
                    application.Job.RecruiterUserId == recruiterUserId)
                .OrderByDescending(application => application.AppliedAt)
                .ToListAsync();
        }

        public async Task AddAsync(JobApplication application)
        {
            await _context.JobApplications.AddAsync(application);
        }

        public void Update(JobApplication application)
        {
            _context.JobApplications.Update(application);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}