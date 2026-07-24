namespace TalentSyncAI.Api.DTOs.Departments;

public class DepartmentResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int OrganizationId { get; set; }

    public string? OrganizationName { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}