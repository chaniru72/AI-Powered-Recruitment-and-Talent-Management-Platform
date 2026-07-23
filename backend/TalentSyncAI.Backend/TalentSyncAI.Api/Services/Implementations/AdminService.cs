using Microsoft.AspNetCore.Hosting;
using TalentSyncAI.Api.DTOs.Admin;
using TalentSyncAI.Api.DTOs.Departments;
using TalentSyncAI.Api.DTOs.Jobs;
using TalentSyncAI.Api.DTOs.Organizations;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IWebHostEnvironment _environment;

        public AdminService(
            IAdminRepository adminRepository,
            IWebHostEnvironment environment)
        {
            _adminRepository = adminRepository;
            _environment = environment;
        }

        public async Task<AdminDashboardResponseDto> GetDashboardAsync()
        {
            var totalUsers = await _adminRepository.CountUsersAsync();
            var activeUsers = await _adminRepository.CountActiveUsersAsync();

            return new AdminDashboardResponseDto
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                InactiveUsers = totalUsers - activeUsers,
                TotalCandidates =
                    await _adminRepository.CountUsersByRoleAsync(
                        UserRole.Candidate),
                TotalRecruiters =
                    await _adminRepository.CountUsersByRoleAsync(
                        UserRole.Recruiter),
                TotalHiringManagers =
                    await _adminRepository.CountUsersByRoleAsync(
                        UserRole.HiringManager),
                TotalAdministrators =
                    await _adminRepository.CountUsersByRoleAsync(
                        UserRole.Administrator),
                TotalOrganizations =
                    await _adminRepository.CountOrganizationsAsync(),
                TotalJobs =
                    await _adminRepository.CountJobsAsync(),
                ActiveJobs =
                    await _adminRepository.CountJobsByStatusAsync(
                        JobStatus.Open),
                ClosedJobs =
                    await _adminRepository.CountJobsByStatusAsync(
                        JobStatus.Closed),
                TotalApplications =
                    await _adminRepository.CountApplicationsAsync(),
                TotalInterviews =
                    await _adminRepository.CountInterviewsAsync(),
                TotalEvaluations =
                    await _adminRepository.CountEvaluationsAsync()
            };
        }

        public async Task<List<AdminUserResponseDto>> GetUsersAsync(
            string? searchTerm,
            UserRole? role,
            bool? isActive)
        {
            var users = await _adminRepository.GetUsersAsync(
                searchTerm,
                role,
                isActive);

            return users
                .Select(MapUserToResponseDto)
                .ToList();
        }

        public async Task<AdminUserResponseDto?> GetUserByIdAsync(int userId)
        {
            var user = await _adminRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            return MapUserToResponseDto(user);
        }

        public async Task<AdminUserResponseDto?> UpdateUserStatusAsync(
            int currentAdminUserId,
            int userId,
            UpdateUserStatusRequestDto request)
        {
            var user = await _adminRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            if (currentAdminUserId == userId && !request.IsActive)
            {
                throw new InvalidOperationException(
                    "Admin cannot deactivate their own account.");
            }

            user.IsActive = request.IsActive;

            _adminRepository.UpdateUser(user);

            await AddAuditLogAsync(
                currentAdminUserId,
                "UpdateUserStatus",
                "User",
                user.Id,
                $"Changed user status to IsActive={request.IsActive}.");

            await _adminRepository.SaveChangesAsync();

            return MapUserToResponseDto(user);
        }

        public async Task<AdminUserResponseDto?> UpdateUserRoleAsync(
            int currentAdminUserId,
            int userId,
            UpdateUserRoleRequestDto request)
        {
            var user = await _adminRepository.GetUserByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            if (currentAdminUserId == userId &&
                request.Role != UserRole.Administrator)
            {
                throw new InvalidOperationException(
                    "Admin cannot remove their own Admin role.");
            }

            var previousRole = user.Role;

            user.Role = request.Role;

            _adminRepository.UpdateUser(user);

            await AddAuditLogAsync(
                currentAdminUserId,
                "UpdateUserRole",
                "User",
                user.Id,
                $"Changed user role from {previousRole} to {request.Role}.");

            await _adminRepository.SaveChangesAsync();

            return MapUserToResponseDto(user);
        }

        public async Task<List<OrganizationResponseDto>> GetOrganizationsAsync()
        {
            var organizations =
                await _adminRepository.GetOrganizationsAsync();

            return organizations
                .Select(MapOrganizationToResponseDto)
                .ToList();
        }

        public async Task<List<DepartmentResponseDto>>
            GetDepartmentsByOrganizationIdAsync(int organizationId)
        {
            var departments =
                await _adminRepository.GetDepartmentsByOrganizationIdAsync(
                    organizationId);

            return departments
                .Select(MapDepartmentToResponseDto)
                .ToList();
        }

        public async Task<DepartmentResponseDto?> CreateDepartmentAsync(
            int currentAdminUserId,
            int organizationId,
            CreateDepartmentRequestDto request)
        {
            var organization =
                await _adminRepository.GetOrganizationByIdAsync(
                    organizationId);

            if (organization == null)
            {
                return null;
            }

            var department = new Department
            {
                Name = request.Name.Trim(),
                Description = request.Description?.Trim(),
                OrganizationId = organizationId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _adminRepository.AddDepartmentAsync(department);
            await _adminRepository.SaveChangesAsync();

            await AddAuditLogAsync(
                currentAdminUserId,
                "CreateDepartment",
                "Department",
                department.Id,
                $"Created department '{department.Name}'.");

            await _adminRepository.SaveChangesAsync();

            var createdDepartment =
                await _adminRepository.GetDepartmentByIdAsync(
                    department.Id);

            return MapDepartmentToResponseDto(createdDepartment!);
        }

        public async Task<DepartmentResponseDto?> UpdateDepartmentAsync(
            int currentAdminUserId,
            int departmentId,
            UpdateDepartmentRequestDto request)
        {
            var department =
                await _adminRepository.GetDepartmentByIdAsync(departmentId);

            if (department == null)
            {
                return null;
            }

            department.Name = request.Name.Trim();
            department.Description = request.Description?.Trim();
            department.IsActive = request.IsActive;

            _adminRepository.UpdateDepartment(department);

            await AddAuditLogAsync(
                currentAdminUserId,
                "UpdateDepartment",
                "Department",
                department.Id,
                $"Updated department '{department.Name}'.");

            await _adminRepository.SaveChangesAsync();

            return MapDepartmentToResponseDto(department);
        }

        public async Task<bool> DeleteDepartmentAsync(
            int currentAdminUserId,
            int departmentId)
        {
            var department =
                await _adminRepository.GetDepartmentByIdAsync(departmentId);

            if (department == null)
            {
                return false;
            }

            var departmentName = department.Name;

            _adminRepository.DeleteDepartment(department);

            await AddAuditLogAsync(
                currentAdminUserId,
                "DeleteDepartment",
                "Department",
                department.Id,
                $"Deleted department '{departmentName}'.");

            await _adminRepository.SaveChangesAsync();

            return true;
        }

        public async Task<List<JobResponseDto>> GetJobsAsync(
            JobStatus? status)
        {
            var jobs = await _adminRepository.GetJobsAsync(status);

            return jobs
                .Select(MapJobToResponseDto)
                .ToList();
        }

        public async Task<JobResponseDto?> UpdateJobStatusAsync(
            int currentAdminUserId,
            int jobId,
            JobStatus status)
        {
            var job = await _adminRepository.GetJobByIdAsync(jobId);

            if (job == null)
            {
                return null;
            }

            var previousStatus = job.Status;

            job.Status = status;
            job.UpdatedAt = DateTime.UtcNow;

            _adminRepository.UpdateJob(job);

            await AddAuditLogAsync(
                currentAdminUserId,
                "UpdateJobStatus",
                "Job",
                job.Id,
                $"Changed job status from {previousStatus} to {status}.");

            await _adminRepository.SaveChangesAsync();

            return MapJobToResponseDto(job);
        }

        public async Task<AdminSystemStatusResponseDto> GetSystemStatusAsync()
        {
            string databaseStatus;

            try
            {
                databaseStatus =
                    await _adminRepository.CanConnectToDatabaseAsync()
                        ? "Connected"
                        : "Unavailable";
            }
            catch
            {
                databaseStatus = "Unavailable";
            }

            return new AdminSystemStatusResponseDto
            {
                ApiStatus = "Healthy",
                DatabaseStatus = databaseStatus,
                ServerTime = DateTime.UtcNow,
                Environment = _environment.EnvironmentName,
                Version = "1.0.0"
            };
        }

        public async Task<List<AdminAuditLogResponseDto>>
            GetAuditLogsAsync()
        {
            var auditLogs = await _adminRepository.GetAuditLogsAsync();

            return auditLogs
                .Select(MapAuditLogToResponseDto)
                .ToList();
        }

        private async Task AddAuditLogAsync(
            int adminUserId,
            string action,
            string entityName,
            int? entityId,
            string details)
        {
            var auditLog = new AuditLog
            {
                AdminUserId = adminUserId,
                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                Details = details,
                CreatedAt = DateTime.UtcNow
            };

            await _adminRepository.AddAuditLogAsync(auditLog);
        }

        private static AdminUserResponseDto MapUserToResponseDto(User user)
        {
            return new AdminUserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        private static OrganizationResponseDto MapOrganizationToResponseDto(
            Organization organization)
        {
            return new OrganizationResponseDto
            {
                Id = organization.Id,
                RecruiterUserId = organization.RecruiterUserId,
                RecruiterName =
                    organization.RecruiterUser?.FullName ?? string.Empty,
                RecruiterEmail =
                    organization.RecruiterUser?.Email ?? string.Empty,
                Name = organization.Name,
                Industry = organization.Industry,
                Description = organization.Description,
                Location = organization.Location,
                WebsiteUrl = organization.WebsiteUrl,
                CreatedAt = organization.CreatedAt,
                UpdatedAt = organization.UpdatedAt
            };
        }

        private static DepartmentResponseDto MapDepartmentToResponseDto(
            Department department)
        {
            return new DepartmentResponseDto
            {
                Id = department.Id,
                Name = department.Name,
                Description = department.Description,
                OrganizationId = department.OrganizationId,
                OrganizationName = department.Organization?.Name,
                IsActive = department.IsActive,
                CreatedAt = department.CreatedAt
            };
        }

        private static JobResponseDto MapJobToResponseDto(Job job)
        {
            return new JobResponseDto
            {
                Id = job.Id,
                OrganizationId = job.OrganizationId,
                OrganizationName = job.Organization?.Name ?? string.Empty,
                RecruiterUserId = job.RecruiterUserId,
                RecruiterName = job.RecruiterUser?.FullName ?? string.Empty,
                Title = job.Title,
                Description = job.Description,
                RequiredSkills = job.RequiredSkills,
                Location = job.Location,
                EmploymentType = job.EmploymentType,
                ExperienceLevel = job.ExperienceLevel,
                SalaryRange = job.SalaryRange,
                Status = job.Status,
                ApplicationDeadline = job.ApplicationDeadline,
                CreatedAt = job.CreatedAt,
                UpdatedAt = job.UpdatedAt
            };
        }

        private static AdminAuditLogResponseDto MapAuditLogToResponseDto(
            AuditLog auditLog)
        {
            return new AdminAuditLogResponseDto
            {
                Id = auditLog.Id,
                Action = auditLog.Action,
                EntityName = auditLog.EntityName,
                EntityId = auditLog.EntityId,
                AdminUserId = auditLog.AdminUserId,
                AdminEmail = auditLog.AdminUser?.Email,
                Details = auditLog.Details,
                CreatedAt = auditLog.CreatedAt
            };
        }
    }
}