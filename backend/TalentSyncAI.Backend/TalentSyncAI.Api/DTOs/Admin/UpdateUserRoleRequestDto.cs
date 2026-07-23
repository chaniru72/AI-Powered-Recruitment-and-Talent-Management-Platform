using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Admin;

public class UpdateUserRoleRequestDto
{
    public UserRole Role { get; set; }
}