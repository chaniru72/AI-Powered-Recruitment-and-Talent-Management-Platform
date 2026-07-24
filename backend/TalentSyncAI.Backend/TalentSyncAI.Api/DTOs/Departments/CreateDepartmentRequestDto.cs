using System.ComponentModel.DataAnnotations;

namespace TalentSyncAI.Api.DTOs.Departments;

public class CreateDepartmentRequestDto
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }
}