namespace TalentSyncAI.Api.DTOs.Analytics
{
    public class AnalyticsSummaryResponseDto
    {
        public int TotalUsers { get; set; }

        public int TotalCandidates { get; set; }

        public int TotalRecruiters { get; set; }

        public int TotalOrganizations { get; set; }

        public int TotalJobs { get; set; }

        public int TotalOpenJobs { get; set; }

        public int TotalApplications { get; set; }

        public int TotalShortlistedApplications { get; set; }

        public int TotalRejectedApplications { get; set; }

        public int TotalHiredApplications { get; set; }
    }
}