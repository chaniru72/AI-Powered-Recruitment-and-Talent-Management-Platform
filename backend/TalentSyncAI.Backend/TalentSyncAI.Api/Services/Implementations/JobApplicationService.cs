using TalentSyncAI.Api.DTOs.Applications;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly IJobApplicationRepository _applicationRepository;

        public JobApplicationService(
            IJobApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        public async Task<JobApplicationResponseDto> ApplyForJobAsync(
            int jobId,
            int candidateUserId,
            ApplyJobRequestDto request)
        {
            var job = await _applicationRepository.GetJobByIdAsync(jobId);

            if (job == null)
            {
                throw new InvalidOperationException("Job not found.");
            }

            if (job.Status != JobStatus.Open)
            {
                throw new InvalidOperationException(
                    "This job is not open for applications.");
            }

            if (job.ApplicationDeadline.HasValue &&
                job.ApplicationDeadline.Value < DateTime.UtcNow)
            {
                throw new InvalidOperationException(
                    "The application deadline has passed.");
            }

            var alreadyApplied =
                await _applicationRepository.HasCandidateAppliedAsync(
                    jobId,
                    candidateUserId);

            if (alreadyApplied)
            {
                throw new InvalidOperationException(
                    "You have already applied for this job.");
            }

            var application = new JobApplication
            {
                JobId = jobId,
                CandidateUserId = candidateUserId,
                CoverLetter = request.CoverLetter,
                Status = ApplicationStatus.Applied,
                AppliedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _applicationRepository.AddAsync(application);
            await _applicationRepository.SaveChangesAsync();

            var createdApplication =
                await _applicationRepository.GetByIdAsync(application.Id);

            return MapToResponseDto(createdApplication!);
        }

        public async Task<List<JobApplicationResponseDto>> GetMyApplicationsAsync(
            int candidateUserId)
        {
            var applications =
                await _applicationRepository.GetApplicationsByCandidateAsync(
                    candidateUserId);

            return applications
                .Select(MapToResponseDto)
                .ToList();
        }

        public async Task<List<JobApplicationResponseDto>> GetApplicationsForJobAsync(
            int jobId,
            int recruiterUserId)
        {
            var applications =
                await _applicationRepository.GetApplicationsByJobForRecruiterAsync(
                    jobId,
                    recruiterUserId);

            return applications
                .Select(MapToResponseDto)
                .ToList();
        }

        public async Task<JobApplicationResponseDto?> UpdateApplicationStatusAsync(
            int applicationId,
            int recruiterUserId,
            UpdateApplicationStatusRequestDto request)
        {
            var application =
                await _applicationRepository.GetByIdForRecruiterAsync(
                    applicationId,
                    recruiterUserId);

            if (application == null)
            {
                return null;
            }

            application.Status = request.Status;
            application.UpdatedAt = DateTime.UtcNow;

            _applicationRepository.Update(application);
            await _applicationRepository.SaveChangesAsync();

            var updatedApplication =
                await _applicationRepository.GetByIdAsync(application.Id);

            return MapToResponseDto(updatedApplication!);
        }

        private static JobApplicationResponseDto MapToResponseDto(
            JobApplication application)
        {
            return new JobApplicationResponseDto
            {
                Id = application.Id,
                JobId = application.JobId,
                JobTitle = application.Job?.Title ?? string.Empty,
                CandidateUserId = application.CandidateUserId,
                CandidateName = application.CandidateUser?.FullName ?? string.Empty,
                CandidateEmail = application.CandidateUser?.Email ?? string.Empty,
                CoverLetter = application.CoverLetter,
                Status = application.Status,
                AppliedAt = application.AppliedAt,
                UpdatedAt = application.UpdatedAt
            };
        }
    }
}