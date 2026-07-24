using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.Admin;
using TalentSyncAI.Api.DTOs.Departments;
using TalentSyncAI.Api.DTOs.Jobs;
using TalentSyncAI.Api.DTOs.Organizations;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = nameof(UserRole.Administrator))]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // GET: /api/admin/dashboard
        [HttpGet("dashboard")]
        public async Task<ActionResult<AdminDashboardResponseDto>>
            GetDashboard()
        {
            var dashboard = await _adminService.GetDashboardAsync();

            return Ok(dashboard);
        }

        // GET: /api/admin/users?searchTerm=john&role=Candidate&isActive=true
        [HttpGet("users")]
        public async Task<ActionResult<List<AdminUserResponseDto>>> GetUsers(
            [FromQuery] string? searchTerm,
            [FromQuery] UserRole? role,
            [FromQuery] bool? isActive)
        {
            var users = await _adminService.GetUsersAsync(
                searchTerm,
                role,
                isActive);

            return Ok(users);
        }

        // GET: /api/admin/users/1
        [HttpGet("users/{userId:int}")]
        public async Task<ActionResult<AdminUserResponseDto>> GetUserById(
            int userId)
        {
            var user = await _adminService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            return Ok(user);
        }

        // PUT: /api/admin/users/1/status
        [HttpPut("users/{userId:int}/status")]
        public async Task<ActionResult<AdminUserResponseDto>>
            UpdateUserStatus(
                int userId,
                UpdateUserStatusRequestDto request)
        {
            if (!TryGetCurrentUserId(out var currentAdminUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            try
            {
                var updatedUser =
                    await _adminService.UpdateUserStatusAsync(
                        currentAdminUserId,
                        userId,
                        request);

                if (updatedUser == null)
                {
                    return NotFound(new
                    {
                        message = "User not found."
                    });
                }

                return Ok(updatedUser);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // PUT: /api/admin/users/1/role
        [HttpPut("users/{userId:int}/role")]
        public async Task<ActionResult<AdminUserResponseDto>> UpdateUserRole(
            int userId,
            UpdateUserRoleRequestDto request)
        {
            if (!TryGetCurrentUserId(out var currentAdminUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            try
            {
                var updatedUser =
                    await _adminService.UpdateUserRoleAsync(
                        currentAdminUserId,
                        userId,
                        request);

                if (updatedUser == null)
                {
                    return NotFound(new
                    {
                        message = "User not found."
                    });
                }

                return Ok(updatedUser);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // GET: /api/admin/organizations
        [HttpGet("organizations")]
        public async Task<ActionResult<List<OrganizationResponseDto>>>
            GetOrganizations()
        {
            var organizations =
                await _adminService.GetOrganizationsAsync();

            return Ok(organizations);
        }

        // GET: /api/admin/organizations/1/departments
        [HttpGet("organizations/{organizationId:int}/departments")]
        public async Task<ActionResult<List<DepartmentResponseDto>>>
            GetOrganizationDepartments(int organizationId)
        {
            var departments =
                await _adminService.GetDepartmentsByOrganizationIdAsync(
                    organizationId);

            return Ok(departments);
        }

        // POST: /api/admin/organizations/1/departments
        [HttpPost("organizations/{organizationId:int}/departments")]
        public async Task<ActionResult<DepartmentResponseDto>>
            CreateDepartment(
                int organizationId,
                CreateDepartmentRequestDto request)
        {
            if (!TryGetCurrentUserId(out var currentAdminUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var department =
                await _adminService.CreateDepartmentAsync(
                    currentAdminUserId,
                    organizationId,
                    request);

            if (department == null)
            {
                return NotFound(new
                {
                    message = "Organization not found."
                });
            }

            return CreatedAtAction(
                nameof(GetOrganizationDepartments),
                new { organizationId },
                department);
        }

        // PUT: /api/admin/departments/1
        [HttpPut("departments/{departmentId:int}")]
        public async Task<ActionResult<DepartmentResponseDto>>
            UpdateDepartment(
                int departmentId,
                UpdateDepartmentRequestDto request)
        {
            if (!TryGetCurrentUserId(out var currentAdminUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var department =
                await _adminService.UpdateDepartmentAsync(
                    currentAdminUserId,
                    departmentId,
                    request);

            if (department == null)
            {
                return NotFound(new
                {
                    message = "Department not found."
                });
            }

            return Ok(department);
        }

        // DELETE: /api/admin/departments/1
        [HttpDelete("departments/{departmentId:int}")]
        public async Task<IActionResult> DeleteDepartment(int departmentId)
        {
            if (!TryGetCurrentUserId(out var currentAdminUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var deleted =
                await _adminService.DeleteDepartmentAsync(
                    currentAdminUserId,
                    departmentId);

            if (!deleted)
            {
                return NotFound(new
                {
                    message = "Department not found."
                });
            }

            return NoContent();
        }

        // GET: /api/admin/jobs?status=Open
        [HttpGet("jobs")]
        public async Task<ActionResult<List<JobResponseDto>>> GetJobs(
            [FromQuery] JobStatus? status)
        {
            var jobs = await _adminService.GetJobsAsync(status);

            return Ok(jobs);
        }

        // PUT: /api/admin/jobs/1/status?status=Closed
        [HttpPut("jobs/{jobId:int}/status")]
        public async Task<ActionResult<JobResponseDto>> UpdateJobStatus(
            int jobId,
            [FromQuery] JobStatus status)
        {
            if (!TryGetCurrentUserId(out var currentAdminUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid or missing user id in token."
                });
            }

            var updatedJob =
                await _adminService.UpdateJobStatusAsync(
                    currentAdminUserId,
                    jobId,
                    status);

            if (updatedJob == null)
            {
                return NotFound(new
                {
                    message = "Job not found."
                });
            }

            return Ok(updatedJob);
        }

        // GET: /api/admin/system/status
        [HttpGet("system/status")]
        public async Task<ActionResult<AdminSystemStatusResponseDto>>
            GetSystemStatus()
        {
            var status = await _adminService.GetSystemStatusAsync();

            return Ok(status);
        }

        // GET: /api/admin/audit-logs
        [HttpGet("audit-logs")]
        public async Task<ActionResult<List<AdminAuditLogResponseDto>>>
            GetAuditLogs()
        {
            var auditLogs = await _adminService.GetAuditLogsAsync();

            return Ok(auditLogs);
        }

        private bool TryGetCurrentUserId(out int userId)
        {
            userId = 0;

            var userIdValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? User.FindFirstValue("userId")
                ?? User.FindFirstValue("id");

            return int.TryParse(userIdValue, out userId);
        }
    }
}