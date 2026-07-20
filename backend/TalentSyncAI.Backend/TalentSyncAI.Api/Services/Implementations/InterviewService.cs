using TalentSyncAI.Api.DTOs.Interviews;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class InterviewService : IInterviewService
    {
        private readonly IInterviewRepository _interviewRepository;

        public InterviewService(
            IInterviewRepository interviewRepository)
        {
            _interviewRepository = interviewRepository;
        }

        public async Task<InterviewResponseDto> CreateInterviewAsync(
            int recruiterUserId,
            CreateInterviewRequestDto request)
        {
            var application =
                await _interviewRepository
                    .GetApplicationForRecruiterAsync(
                        request.JobApplicationId,
                        recruiterUserId);

            if (application == null)
            {
                throw new KeyNotFoundException(
                    "Application not found or you do not have permission to schedule an interview for it.");
            }

            if (request.ScheduledAt <= DateTime.UtcNow)
            {
                throw new InvalidOperationException(
                    "Interview date and time must be in the future.");
            }

            var interview = new Interview
            {
                JobApplicationId = request.JobApplicationId,
                Title = request.Title,
                ScheduledAt = request.ScheduledAt,
                DurationMinutes = request.DurationMinutes,
                MeetingLink = request.MeetingLink,
                Location = request.Location,
                Notes = request.Notes,
                Status = InterviewStatus.Scheduled,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                JobApplication = application
            };

            await _interviewRepository.AddAsync(interview);
            await _interviewRepository.SaveChangesAsync();

            return MapToResponseDto(interview);
        }

        public async Task<List<InterviewResponseDto>>
            GetInterviewsForApplicationAsync(
                int applicationId,
                int recruiterUserId)
        {
            var application =
                await _interviewRepository
                    .GetApplicationForRecruiterAsync(
                        applicationId,
                        recruiterUserId);

            if (application == null)
            {
                throw new KeyNotFoundException(
                    "Application not found or you do not have permission to view its interviews.");
            }

            var interviews =
                await _interviewRepository
                    .GetByApplicationForRecruiterAsync(
                        applicationId,
                        recruiterUserId);

            return interviews
                .Select(MapToResponseDto)
                .ToList();
        }

        public async Task<List<InterviewResponseDto>>
            GetMyInterviewsAsync(
                int candidateUserId)
        {
            var interviews =
                await _interviewRepository
                    .GetByCandidateAsync(
                        candidateUserId);

            return interviews
                .Select(MapToResponseDto)
                .ToList();
        }

        public async Task<InterviewResponseDto?>
            UpdateInterviewAsync(
                int interviewId,
                int recruiterUserId,
                UpdateInterviewRequestDto request)
        {
            var interview =
                await _interviewRepository
                    .GetByIdForRecruiterAsync(
                        interviewId,
                        recruiterUserId);

            if (interview == null)
            {
                return null;
            }

            if (request.ScheduledAt <= DateTime.UtcNow &&
                request.Status != InterviewStatus.Completed &&
                request.Status != InterviewStatus.Cancelled &&
                request.Status != InterviewStatus.NoShow)
            {
                throw new InvalidOperationException(
                    "Active interview date and time must be in the future.");
            }

            interview.Title = request.Title;
            interview.ScheduledAt = request.ScheduledAt;
            interview.DurationMinutes = request.DurationMinutes;
            interview.MeetingLink = request.MeetingLink;
            interview.Location = request.Location;
            interview.Notes = request.Notes;
            interview.Status = request.Status;
            interview.UpdatedAt = DateTime.UtcNow;

            _interviewRepository.Update(interview);
            await _interviewRepository.SaveChangesAsync();

            return MapToResponseDto(interview);
        }

        public async Task<bool> DeleteInterviewAsync(
            int interviewId,
            int recruiterUserId)
        {
            var interview =
                await _interviewRepository
                    .GetByIdForRecruiterAsync(
                        interviewId,
                        recruiterUserId);

            if (interview == null)
            {
                return false;
            }

            _interviewRepository.Delete(interview);
            await _interviewRepository.SaveChangesAsync();

            return true;
        }

        private static InterviewResponseDto MapToResponseDto(
            Interview interview)
        {
            var application = interview.JobApplication;

            return new InterviewResponseDto
            {
                Id = interview.Id,
                JobApplicationId = interview.JobApplicationId,
                JobId = application?.JobId ?? 0,
                JobTitle = application?.Job?.Title
                    ?? string.Empty,
                CandidateUserId =
                    application?.CandidateUserId ?? 0,
                CandidateName =
                    application?.CandidateUser?.FullName
                    ?? string.Empty,
                CandidateEmail =
                    application?.CandidateUser?.Email
                    ?? string.Empty,
                Title = interview.Title,
                ScheduledAt = interview.ScheduledAt,
                DurationMinutes = interview.DurationMinutes,
                MeetingLink = interview.MeetingLink,
                Location = interview.Location,
                Notes = interview.Notes,
                Status = interview.Status,
                CreatedAt = interview.CreatedAt,
                UpdatedAt = interview.UpdatedAt
            };
        }
    }
}