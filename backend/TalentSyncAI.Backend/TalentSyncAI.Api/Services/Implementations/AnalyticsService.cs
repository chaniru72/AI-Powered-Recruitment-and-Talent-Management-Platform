using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.DTOs.Analytics;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AnalyticsSummaryResponseDto> GetSummaryAsync()
        {
            return new AnalyticsSummaryResponseDto
            {
                TotalUsers = await _context.Users.CountAsync(),

                TotalCandidates = await _context.Users
                    .CountAsync(user => user.Role == UserRole.Candidate),

                TotalRecruiters = await _context.Users
                    .CountAsync(user => user.Role == UserRole.Recruiter),

                TotalOrganizations = await _context.Organizations.CountAsync(),

                TotalJobs = await _context.Jobs.CountAsync(),

                TotalOpenJobs = await _context.Jobs
                    .CountAsync(job => job.Status == JobStatus.Open),

                TotalApplications = await _context.JobApplications.CountAsync(),

                TotalShortlistedApplications = await _context.JobApplications
                    .CountAsync(application =>
                        application.Status == ApplicationStatus.Shortlisted),

                TotalRejectedApplications = await _context.JobApplications
                    .CountAsync(application =>
                        application.Status == ApplicationStatus.Rejected),

                TotalHiredApplications = await _context.JobApplications
                    .CountAsync(application =>
                        application.Status == ApplicationStatus.Hired)
            };
        }
    }
}