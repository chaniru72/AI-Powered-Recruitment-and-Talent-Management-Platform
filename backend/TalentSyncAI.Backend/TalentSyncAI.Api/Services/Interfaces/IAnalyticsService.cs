using TalentSyncAI.Api.DTOs.Analytics;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IAnalyticsService
    {
        Task<AnalyticsSummaryResponseDto> GetSummaryAsync();
    }
}