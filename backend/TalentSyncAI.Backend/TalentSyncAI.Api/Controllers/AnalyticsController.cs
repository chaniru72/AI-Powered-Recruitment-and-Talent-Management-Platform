using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentSyncAI.Api.DTOs.Analytics;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = nameof(UserRole.Recruiter))]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        // GET: /api/analytics/summary
        [HttpGet("summary")]
        public async Task<ActionResult<AnalyticsSummaryResponseDto>> GetSummary()
        {
            var summary = await _analyticsService.GetSummaryAsync();

            return Ok(summary);
        }
    }
}