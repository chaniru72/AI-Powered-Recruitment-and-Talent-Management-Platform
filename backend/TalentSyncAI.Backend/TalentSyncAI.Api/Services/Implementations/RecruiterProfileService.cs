using TalentSyncAI.Api.DTOs.Recruiters;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class RecruiterProfileService
        : IRecruiterProfileService
    {
        private readonly IRecruiterProfileRepository
            _profileRepository;

        private readonly IUserRepository
            _userRepository;

        public RecruiterProfileService(
            IRecruiterProfileRepository profileRepository,
            IUserRepository userRepository)
        {
            _profileRepository = profileRepository;
            _userRepository = userRepository;
        }

        public async Task<RecruiterProfileResponseDto?>
            GetMyProfileAsync(int userId)
        {
            RecruiterProfile? profile =
                await _profileRepository
                    .GetByUserIdAsync(userId);

            if (profile is null)
            {
                return null;
            }

            return MapToResponse(profile);
        }

        public async Task<RecruiterProfileResponseDto>
            CreateOrUpdateMyProfileAsync(
                int userId,
                UpdateRecruiterProfileDto request)
        {
            RecruiterProfile? profile =
                await _profileRepository
                    .GetByUserIdAsync(userId);

            if (profile is null)
            {
                User? user =
                    await _userRepository
                        .GetByIdAsync(userId);

                if (user is null)
                {
                    throw new InvalidOperationException(
                        "Authenticated user was not found.");
                }

                profile = new RecruiterProfile
                {
                    UserId = userId,
                    User = user
                };

                await _profileRepository
                    .AddAsync(profile);
            }

            profile.Phone = request.Phone.Trim();

            profile.JobTitle =
                request.JobTitle.Trim();

            profile.Location =
                request.Location.Trim();

            profile.ProfessionalSummary =
                request.ProfessionalSummary.Trim();

            profile.LinkedInUrl =
                string.IsNullOrWhiteSpace(
                    request.LinkedInUrl)
                    ? null
                    : request.LinkedInUrl.Trim();

            profile.UpdatedAt = DateTime.UtcNow;

            await _profileRepository
                .SaveChangesAsync();

            return MapToResponse(profile);
        }

        private static RecruiterProfileResponseDto
            MapToResponse(
                RecruiterProfile profile)
        {
            return new RecruiterProfileResponseDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                FullName = profile.User.FullName,
                Email = profile.User.Email,
                Phone = profile.Phone,
                JobTitle = profile.JobTitle,
                Location = profile.Location,
                ProfessionalSummary =
                    profile.ProfessionalSummary,
                LinkedInUrl = profile.LinkedInUrl,
                UpdatedAt = profile.UpdatedAt
            };
        }
    }
}