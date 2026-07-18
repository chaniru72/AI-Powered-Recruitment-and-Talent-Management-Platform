using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TalentSyncAI.Api.DTOs.Organizations;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = nameof(UserRole.Recruiter))]
    public class OrganizationsController
        : ControllerBase
    {
        private readonly IOrganizationService
            _organizationService;

        public OrganizationsController(
            IOrganizationService organizationService)
        {
            _organizationService =
                organizationService;
        }

        // GET: /api/organizations/me
        [HttpGet("me")]
        public async Task<IActionResult>
            GetMyOrganization()
        {
            int? recruiterUserId =
                GetCurrentUserId();

            if (recruiterUserId is null)
            {
                return Unauthorized(new
                {
                    message =
                        "The authenticated Recruiter ID is missing."
                });
            }

            OrganizationResponseDto? organization =
                await _organizationService
                    .GetMyOrganizationAsync(
                        recruiterUserId.Value);

            if (organization is null)
            {
                return NotFound(new
                {
                    message =
                        "Organization has not been created."
                });
            }

            return Ok(organization);
        }

        // PUT: /api/organizations/me
        [HttpPut("me")]
        public async Task<IActionResult>
            CreateOrUpdateMyOrganization(
                UpdateOrganizationDto request)
        {
            int? recruiterUserId =
                GetCurrentUserId();

            if (recruiterUserId is null)
            {
                return Unauthorized(new
                {
                    message =
                        "The authenticated Recruiter ID is missing."
                });
            }

            OrganizationResponseDto organization =
                await _organizationService
                    .CreateOrUpdateMyOrganizationAsync(
                        recruiterUserId.Value,
                        request);

            return Ok(new
            {
                message =
                    "Organization saved successfully.",

                organization
            });
        }

        private int? GetCurrentUserId()
        {
            string? userIdValue =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!int.TryParse(
                    userIdValue,
                    out int userId))
            {
                return null;
            }

            return userId;
        }
    }
}