using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;

namespace TalentSyncAI.Api.Repositories.Implementations
{
    public class InterviewRepository : IInterviewRepository
    {
        private readonly ApplicationDbContext _context;

        public InterviewRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<JobApplication?>
            GetApplicationForRecruiterAsync(
                int applicationId,
                int recruiterUserId)
        {
            return await _context.JobApplications
                .Include(application => application.Job)
                .Include(application =>
                    application.CandidateUser)
                .FirstOrDefaultAsync(application =>
                    application.Id == applicationId &&
                    application.Job.RecruiterUserId ==
                        recruiterUserId);
        }

        public async Task<List<Interview>>
            GetByApplicationForRecruiterAsync(
                int applicationId,
                int recruiterUserId)
        {
            return await _context.Interviews
                .Include(interview =>
                    interview.JobApplication)
                    .ThenInclude(application =>
                        application.Job)
                .Include(interview =>
                    interview.JobApplication)
                    .ThenInclude(application =>
                        application.CandidateUser)
                .Where(interview =>
                    interview.JobApplicationId ==
                        applicationId &&
                    interview.JobApplication.Job
                        .RecruiterUserId ==
                        recruiterUserId)
                .OrderBy(interview =>
                    interview.ScheduledAt)
                .ToListAsync();
        }

        public async Task<List<Interview>>
            GetByCandidateAsync(
                int candidateUserId)
        {
            return await _context.Interviews
                .Include(interview =>
                    interview.JobApplication)
                    .ThenInclude(application =>
                        application.Job)
                .Include(interview =>
                    interview.JobApplication)
                    .ThenInclude(application =>
                        application.CandidateUser)
                .Where(interview =>
                    interview.JobApplication
                        .CandidateUserId ==
                        candidateUserId)
                .OrderBy(interview =>
                    interview.ScheduledAt)
                .ToListAsync();
        }

        public async Task<Interview?>
            GetByIdForRecruiterAsync(
                int interviewId,
                int recruiterUserId)
        {
            return await _context.Interviews
                .Include(interview =>
                    interview.JobApplication)
                    .ThenInclude(application =>
                        application.Job)
                .Include(interview =>
                    interview.JobApplication)
                    .ThenInclude(application =>
                        application.CandidateUser)
                .FirstOrDefaultAsync(interview =>
                    interview.Id == interviewId &&
                    interview.JobApplication.Job
                        .RecruiterUserId ==
                        recruiterUserId);
        }

        public async Task AddAsync(
            Interview interview)
        {
            await _context.Interviews
                .AddAsync(interview);
        }

        public void Update(
            Interview interview)
        {
            _context.Interviews.Update(interview);
        }

        public void Delete(
            Interview interview)
        {
            _context.Interviews.Remove(interview);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}