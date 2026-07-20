using TalentSyncAI.Api.DTOs.AI;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IAiMatchingService
    {
        Task<List<CandidateMatchResponseDto>> GetMatchesForJobAsync(
            int jobId,
            int recruiterUserId);
    }
}