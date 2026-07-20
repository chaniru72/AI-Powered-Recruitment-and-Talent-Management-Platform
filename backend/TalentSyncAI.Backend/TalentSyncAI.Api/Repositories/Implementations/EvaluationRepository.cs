using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;

namespace TalentSyncAI.Api.Repositories.Implementations
{
    public class EvaluationRepository
        : IEvaluationRepository
    {
        private readonly ApplicationDbContext _context;

        public EvaluationRepository(
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
                .Include(application =>
                    application.Job)
                .Include(application =>
                    application.CandidateUser)
                .FirstOrDefaultAsync(application =>
                    application.Id == applicationId &&
                    application.Job.RecruiterUserId ==
                        recruiterUserId);
        }

        public async Task<Evaluation?>
            GetByApplicationForRecruiterAsync(
                int applicationId,
                int recruiterUserId)
        {
            return await _context.Evaluations
                .Include(evaluation =>
                    evaluation.JobApplication)
                    .ThenInclude(application =>
                        application.Job)
                .Include(evaluation =>
                    evaluation.JobApplication)
                    .ThenInclude(application =>
                        application.CandidateUser)
                .FirstOrDefaultAsync(evaluation =>
                    evaluation.JobApplicationId ==
                        applicationId &&
                    evaluation.JobApplication.Job
                        .RecruiterUserId ==
                        recruiterUserId);
        }

        public async Task<Evaluation?>
            GetByIdForRecruiterAsync(
                int evaluationId,
                int recruiterUserId)
        {
            return await _context.Evaluations
                .Include(evaluation =>
                    evaluation.JobApplication)
                    .ThenInclude(application =>
                        application.Job)
                .Include(evaluation =>
                    evaluation.JobApplication)
                    .ThenInclude(application =>
                        application.CandidateUser)
                .FirstOrDefaultAsync(evaluation =>
                    evaluation.Id == evaluationId &&
                    evaluation.JobApplication.Job
                        .RecruiterUserId ==
                        recruiterUserId);
        }

        public async Task AddAsync(
            Evaluation evaluation)
        {
            await _context.Evaluations
                .AddAsync(evaluation);
        }

        public void Update(
            Evaluation evaluation)
        {
            _context.Evaluations.Update(evaluation);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}