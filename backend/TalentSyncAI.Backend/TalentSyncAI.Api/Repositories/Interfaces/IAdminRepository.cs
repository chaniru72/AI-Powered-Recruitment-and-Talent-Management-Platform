using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.Repositories.Interfaces
{
    public interface IAdminRepository
    {
        Task<List<User>> GetUsersAsync(
            string? searchTerm,
            UserRole? role,
            bool? isActive);

        Task<User?> GetUserByIdAsync(int userId);

        void UpdateUser(User user);

        Task<List<Organization>> GetOrganizationsAsync();

        Task<Organization?> GetOrganizationByIdAsync(int organizationId);

        Task<List<Department>> GetDepartmentsByOrganizationIdAsync(
            int organizationId);

        Task<Department?> GetDepartmentByIdAsync(int departmentId);

        Task AddDepartmentAsync(Department department);

        void UpdateDepartment(Department department);

        void DeleteDepartment(Department department);

        Task<List<Job>> GetJobsAsync(JobStatus? status);

        Task<Job?> GetJobByIdAsync(int jobId);

        void UpdateJob(Job job);

        Task AddAuditLogAsync(AuditLog auditLog);

        Task<List<AuditLog>> GetAuditLogsAsync();

        Task<int> CountUsersAsync();

        Task<int> CountActiveUsersAsync();

        Task<int> CountUsersByRoleAsync(UserRole role);

        Task<int> CountOrganizationsAsync();

        Task<int> CountJobsAsync();

        Task<int> CountJobsByStatusAsync(JobStatus status);

        Task<int> CountApplicationsAsync();

        Task<int> CountInterviewsAsync();

        Task<int> CountEvaluationsAsync();

        Task<bool> CanConnectToDatabaseAsync();

        Task SaveChangesAsync();
    }
}