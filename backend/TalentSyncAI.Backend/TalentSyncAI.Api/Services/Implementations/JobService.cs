using TalentSyncAI.Api.DTOs.Jobs;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class JobService : IJobService
    {
        private readonly IJobRepository _jobRepository;

        public JobService(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        public async Task<List<JobResponseDto>> GetAllOpenJobsAsync()
        {
            var jobs = await _jobRepository.GetAllOpenJobsAsync();

            return jobs
                .Select(MapToResponseDto)
                .ToList();
        }

        public async Task<JobResponseDto?> GetJobByIdAsync(int jobId)
        {
            var job = await _jobRepository.GetByIdAsync(jobId);

            if (job == null)
            {
                return null;
            }

            return MapToResponseDto(job);
        }

        public async Task<List<JobResponseDto>> GetMyJobsAsync(
            int recruiterUserId)
        {
            var jobs = await _jobRepository.GetJobsByRecruiterAsync(
                recruiterUserId);

            return jobs
                .Select(MapToResponseDto)
                .ToList();
        }

        public async Task<JobResponseDto?> GetMyJobByIdAsync(
            int jobId,
            int recruiterUserId)
        {
            var job = await _jobRepository.GetByIdForRecruiterAsync(
                jobId,
                recruiterUserId);

            if (job == null)
            {
                return null;
            }

            return MapToResponseDto(job);
        }

        public async Task<JobResponseDto> CreateJobAsync(
            int recruiterUserId,
            CreateJobRequestDto request)
        {
            var organizationId =
                await _jobRepository.GetOrganizationIdByRecruiterAsync(
                    recruiterUserId);

            if (organizationId == null)
            {
                throw new InvalidOperationException(
                    "Recruiter must create an organization before posting jobs.");
            }

            var job = new Job
            {
                OrganizationId = organizationId.Value,
                RecruiterUserId = recruiterUserId,
                Title = request.Title,
                Description = request.Description,
                RequiredSkills = request.RequiredSkills,
                Location = request.Location,
                EmploymentType = request.EmploymentType,
                ExperienceLevel = request.ExperienceLevel,
                SalaryRange = request.SalaryRange,
                Status = request.Status,
                ApplicationDeadline = request.ApplicationDeadline,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _jobRepository.AddAsync(job);
            await _jobRepository.SaveChangesAsync();

            var createdJob = await _jobRepository.GetByIdAsync(job.Id);

            return MapToResponseDto(createdJob!);
        }

        public async Task<JobResponseDto?> UpdateJobAsync(
            int jobId,
            int recruiterUserId,
            UpdateJobRequestDto request)
        {
            var job = await _jobRepository.GetByIdForRecruiterAsync(
                jobId,
                recruiterUserId);

            if (job == null)
            {
                return null;
            }

            job.Title = request.Title;
            job.Description = request.Description;
            job.RequiredSkills = request.RequiredSkills;
            job.Location = request.Location;
            job.EmploymentType = request.EmploymentType;
            job.ExperienceLevel = request.ExperienceLevel;
            job.SalaryRange = request.SalaryRange;
            job.Status = request.Status;
            job.ApplicationDeadline = request.ApplicationDeadline;
            job.UpdatedAt = DateTime.UtcNow;

            _jobRepository.Update(job);
            await _jobRepository.SaveChangesAsync();

            var updatedJob = await _jobRepository.GetByIdAsync(job.Id);

            return MapToResponseDto(updatedJob!);
        }

        public async Task<bool> DeleteJobAsync(
            int jobId,
            int recruiterUserId)
        {
            var job = await _jobRepository.GetByIdForRecruiterAsync(
                jobId,
                recruiterUserId);

            if (job == null)
            {
                return false;
            }

            _jobRepository.Delete(job);
            await _jobRepository.SaveChangesAsync();

            return true;
        }

        private static JobResponseDto MapToResponseDto(Job job)
        {
            return new JobResponseDto
            {
                Id = job.Id,
                OrganizationId = job.OrganizationId,
                OrganizationName = job.Organization?.Name ?? string.Empty,
                RecruiterUserId = job.RecruiterUserId,
                RecruiterName = job.RecruiterUser?.FullName ?? string.Empty,
                Title = job.Title,
                Description = job.Description,
                RequiredSkills = job.RequiredSkills,
                Location = job.Location,
                EmploymentType = job.EmploymentType,
                ExperienceLevel = job.ExperienceLevel,
                SalaryRange = job.SalaryRange,
                Status = job.Status,
                ApplicationDeadline = job.ApplicationDeadline,
                CreatedAt = job.CreatedAt,
                UpdatedAt = job.UpdatedAt
            };
        }
    }
}