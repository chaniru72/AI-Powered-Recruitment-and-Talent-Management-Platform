namespace TalentSyncAI.Api.DTOs.Admin;

public class AdminAuditLogResponseDto
{
    public int Id { get; set; }

    public string Action { get; set; } = string.Empty;

    public string EntityName { get; set; } = string.Empty;

    public int? EntityId { get; set; }

    public int? AdminUserId { get; set; }

    public string? AdminEmail { get; set; }

    public string Details { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}