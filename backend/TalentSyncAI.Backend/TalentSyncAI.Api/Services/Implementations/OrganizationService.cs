using TalentSyncAI.Api.DTOs.Organizations;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class OrganizationService
        : IOrganizationService
    {
        private readonly IOrganizationRepository
            _organizationRepository;

        private readonly IUserRepository
            _userRepository;

        public OrganizationService(
            IOrganizationRepository organizationRepository,
            IUserRepository userRepository)
        {
            _organizationRepository =
                organizationRepository;

            _userRepository =
                userRepository;
        }

        public async Task<OrganizationResponseDto?>
            GetMyOrganizationAsync(
                int recruiterUserId)
        {
            Organization? organization =
                await _organizationRepository
                    .GetByRecruiterUserIdAsync(
                        recruiterUserId);

            if (organization is null)
            {
                return null;
            }

            return MapToResponse(organization);
        }

        public async Task<OrganizationResponseDto>
            CreateOrUpdateMyOrganizationAsync(
                int recruiterUserId,
                UpdateOrganizationDto request)
        {
            Organization? organization =
                await _organizationRepository
                    .GetByRecruiterUserIdAsync(
                        recruiterUserId);

            if (organization is null)
            {
                User? recruiter =
                    await _userRepository
                        .GetByIdAsync(recruiterUserId);

                if (recruiter is null)
                {
                    throw new InvalidOperationException(
                        "Authenticated Recruiter was not found.");
                }

                organization = new Organization
                {
                    RecruiterUserId =
                        recruiterUserId,

                    RecruiterUser =
                        recruiter,

                    CreatedAt =
                        DateTime.UtcNow
                };

                await _organizationRepository
                    .AddAsync(organization);
            }

            organization.Name =
                request.Name.Trim();

            organization.Industry =
                request.Industry.Trim();

            organization.Description =
                request.Description.Trim();

            organization.Location =
                request.Location.Trim();

            organization.WebsiteUrl =
                string.IsNullOrWhiteSpace(
                    request.WebsiteUrl)
                    ? null
                    : request.WebsiteUrl.Trim();

            organization.UpdatedAt =
                DateTime.UtcNow;

            await _organizationRepository
                .SaveChangesAsync();

            return MapToResponse(organization);
        }

        private static OrganizationResponseDto
            MapToResponse(
                Organization organization)
        {
            return new OrganizationResponseDto
            {
                Id = organization.Id,

                RecruiterUserId =
                    organization.RecruiterUserId,

                RecruiterName =
                    organization.RecruiterUser.FullName,

                RecruiterEmail =
                    organization.RecruiterUser.Email,

                Name = organization.Name,

                Industry = organization.Industry,

                Description =
                    organization.Description,

                Location = organization.Location,

                WebsiteUrl =
                    organization.WebsiteUrl,

                CreatedAt =
                    organization.CreatedAt,

                UpdatedAt =
                    organization.UpdatedAt
            };
        }
    }
}