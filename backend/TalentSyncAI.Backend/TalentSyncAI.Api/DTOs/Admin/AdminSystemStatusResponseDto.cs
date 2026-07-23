namespace TalentSyncAI.Api.DTOs.Admin;

public class AdminSystemStatusResponseDto
{
    public string ApiStatus { get; set; } = "Healthy";

    public string DatabaseStatus { get; set; } = "Unknown";

    public DateTime ServerTime { get; set; }

    public string Environment { get; set; } = string.Empty;

    public string Version { get; set; } = "1.0.0";
}