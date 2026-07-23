using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Repositories.Interfaces;

namespace TalentSyncAI.Api.Repositories.Implementations
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public AdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetUsersAsync(
            string? searchTerm,
            UserRole? role,
            bool? isActive)
        {
            IQueryable<User> query = _context.Users;

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                string normalizedSearchTerm = searchTerm
                    .Trim()
                    .ToLower();

                query = query.Where(user =>
                    user.FullName.ToLower().Contains(normalizedSearchTerm) ||
                    user.Email.ToLower().Contains(normalizedSearchTerm));
            }

            if (role.HasValue)
            {
                query = query.Where(user => user.Role == role.Value);
            }

            if (isActive.HasValue)
            {
                query = query.Where(user =>
                    user.IsActive == isActive.Value);
            }

            return await query
                .OrderByDescending(user => user.CreatedAt)
                .ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(user => user.Id == userId);
        }

        public void UpdateUser(User user)
        {
            _context.Users.Update(user);
        }

        public async Task<List<Organization>> GetOrganizationsAsync()
        {
            return await _context.Organizations
                .Include(organization => organization.RecruiterUser)
                .Include(organization => organization.Departments)
                .Include(organization => organization.Jobs)
                .OrderByDescending(organization => organization.CreatedAt)
                .ToListAsync();
        }

        public async Task<Organization?> GetOrganizationByIdAsync(
            int organizationId)
        {
            return await _context.Organizations
                .Include(organization => organization.RecruiterUser)
                .Include(organization => organization.Departments)
                .Include(organization => organization.Jobs)
                .FirstOrDefaultAsync(organization =>
                    organization.Id == organizationId);
        }

        public async Task<List<Department>> GetDepartmentsByOrganizationIdAsync(
            int organizationId)
        {
            return await _context.Departments
                .Include(department => department.Organization)
                .Where(department =>
                    department.OrganizationId == organizationId)
                .OrderBy(department => department.Name)
                .ToListAsync();
        }

        public async Task<Department?> GetDepartmentByIdAsync(
            int departmentId)
        {
            return await _context.Departments
                .Include(department => department.Organization)
                .FirstOrDefaultAsync(department =>
                    department.Id == departmentId);
        }

        public async Task AddDepartmentAsync(Department department)
        {
            await _context.Departments.AddAsync(department);
        }

        public void UpdateDepartment(Department department)
        {
            _context.Departments.Update(department);
        }

        public void DeleteDepartment(Department department)
        {
            _context.Departments.Remove(department);
        }

        public async Task<List<Job>> GetJobsAsync(JobStatus? status)
        {
            IQueryable<Job> query = _context.Jobs
                .Include(job => job.Organization)
                .Include(job => job.RecruiterUser);

            if (status.HasValue)
            {
                query = query.Where(job => job.Status == status.Value);
            }

            return await query
                .OrderByDescending(job => job.CreatedAt)
                .ToListAsync();
        }

        public async Task<Job?> GetJobByIdAsync(int jobId)
        {
            return await _context.Jobs
                .Include(job => job.Organization)
                .Include(job => job.RecruiterUser)
                .FirstOrDefaultAsync(job => job.Id == jobId);
        }

        public void UpdateJob(Job job)
        {
            _context.Jobs.Update(job);
        }

        public async Task AddAuditLogAsync(AuditLog auditLog)
        {
            await _context.AuditLogs.AddAsync(auditLog);
        }

        public async Task<List<AuditLog>> GetAuditLogsAsync()
        {
            return await _context.AuditLogs
                .Include(auditLog => auditLog.AdminUser)
                .OrderByDescending(auditLog => auditLog.CreatedAt)
                .Take(100)
                .ToListAsync();
        }

        public async Task<int> CountUsersAsync()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<int> CountActiveUsersAsync()
        {
            return await _context.Users
                .CountAsync(user => user.IsActive);
        }

        public async Task<int> CountUsersByRoleAsync(UserRole role)
        {
            return await _context.Users
                .CountAsync(user => user.Role == role);
        }

        public async Task<int> CountOrganizationsAsync()
        {
            return await _context.Organizations.CountAsync();
        }

        public async Task<int> CountJobsAsync()
        {
            return await _context.Jobs.CountAsync();
        }

        public async Task<int> CountJobsByStatusAsync(JobStatus status)
        {
            return await _context.Jobs
                .CountAsync(job => job.Status == status);
        }

        public async Task<int> CountApplicationsAsync()
        {
            return await _context.JobApplications.CountAsync();
        }

        public async Task<int> CountInterviewsAsync()
        {
            return await _context.Interviews.CountAsync();
        }

        public async Task<int> CountEvaluationsAsync()
        {
            return await _context.Evaluations.CountAsync();
        }

        public async Task<bool> CanConnectToDatabaseAsync()
        {
            return await _context.Database.CanConnectAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}