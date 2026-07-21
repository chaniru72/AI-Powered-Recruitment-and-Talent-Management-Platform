using TalentSyncAI.Api.DTOs.Admin;
using TalentSyncAI.Api.DTOs.Departments;
using TalentSyncAI.Api.DTOs.Jobs;
using TalentSyncAI.Api.DTOs.Organizations;
using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IAdminService
    {
        Task<AdminDashboardResponseDto> GetDashboardAsync();

        Task<List<AdminUserResponseDto>> GetUsersAsync(
            string? searchTerm,
            UserRole? role,
            bool? isActive);

        Task<AdminUserResponseDto?> GetUserByIdAsync(int userId);

        Task<AdminUserResponseDto?> UpdateUserStatusAsync(
            int currentAdminUserId,
            int userId,
            UpdateUserStatusRequestDto request);

        Task<AdminUserResponseDto?> UpdateUserRoleAsync(
            int currentAdminUserId,
            int userId,
            UpdateUserRoleRequestDto request);

        Task<List<OrganizationResponseDto>> GetOrganizationsAsync();

        Task<List<DepartmentResponseDto>> GetDepartmentsByOrganizationIdAsync(
            int organizationId);

        Task<DepartmentResponseDto?> CreateDepartmentAsync(
            int currentAdminUserId,
            int organizationId,
            CreateDepartmentRequestDto request);

        Task<DepartmentResponseDto?> UpdateDepartmentAsync(
            int currentAdminUserId,
            int departmentId,
            UpdateDepartmentRequestDto request);

        Task<bool> DeleteDepartmentAsync(
            int currentAdminUserId,
            int departmentId);

        Task<List<JobResponseDto>> GetJobsAsync(JobStatus? status);

        Task<JobResponseDto?> UpdateJobStatusAsync(
            int currentAdminUserId,
            int jobId,
            JobStatus status);

        Task<AdminSystemStatusResponseDto> GetSystemStatusAsync();

        Task<List<AdminAuditLogResponseDto>> GetAuditLogsAsync();
    }
}