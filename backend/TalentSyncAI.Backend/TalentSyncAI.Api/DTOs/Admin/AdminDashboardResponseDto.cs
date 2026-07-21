namespace TalentSyncAI.Api.DTOs.Admin;

public class AdminDashboardResponseDto
{
    public int TotalUsers { get; set; }

    public int ActiveUsers { get; set; }

    public int InactiveUsers { get; set; }

    public int TotalCandidates { get; set; }

    public int TotalRecruiters { get; set; }

    public int TotalHiringManagers { get; set; }

    public int TotalAdministrators { get; set; }

    public int TotalOrganizations { get; set; }

    public int TotalJobs { get; set; }

    public int ActiveJobs { get; set; }

    public int ClosedJobs { get; set; }

    public int TotalApplications { get; set; }

    public int TotalInterviews { get; set; }

    public int TotalEvaluations { get; set; }
}