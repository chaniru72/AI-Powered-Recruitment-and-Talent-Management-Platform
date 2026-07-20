using TalentSyncAI.Api.DTOs.Interviews;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IInterviewService
    {
        Task<InterviewResponseDto> CreateInterviewAsync(
            int recruiterUserId,
            CreateInterviewRequestDto request);

        Task<List<InterviewResponseDto>>
            GetInterviewsForApplicationAsync(
                int applicationId,
                int recruiterUserId);

        Task<List<InterviewResponseDto>>
            GetMyInterviewsAsync(
                int candidateUserId);

        Task<InterviewResponseDto?>
            UpdateInterviewAsync(
                int interviewId,
                int recruiterUserId,
                UpdateInterviewRequestDto request);

        Task<bool> DeleteInterviewAsync(
            int interviewId,
            int recruiterUserId);
    }
}