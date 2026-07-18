using TalentSyncAI.Api.DTOs.Candidates;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class CandidateProfileService
        : ICandidateProfileService
    {
        private readonly ICandidateProfileRepository
            _profileRepository;

        private readonly IUserRepository
            _userRepository;

        public CandidateProfileService(
            ICandidateProfileRepository profileRepository,
            IUserRepository userRepository)
        {
            _profileRepository = profileRepository;
            _userRepository = userRepository;
        }

        public async Task<CandidateProfileResponseDto?>
            GetMyProfileAsync(int userId)
        {
            CandidateProfile? profile =
                await _profileRepository
                    .GetByUserIdAsync(userId);

            if (profile is null)
            {
                return null;
            }

            return MapToResponse(profile);
        }

        public async Task<CandidateProfileResponseDto>
            CreateOrUpdateMyProfileAsync(
                int userId,
                UpdateCandidateProfileDto request)
        {
            CandidateProfile? profile =
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

                profile = new CandidateProfile
                {
                    UserId = userId,
                    User = user
                };

                await _profileRepository.AddAsync(profile);
            }

            profile.Phone = request.Phone.Trim();
            profile.Location = request.Location.Trim();
            profile.Skills = request.Skills.Trim();
            profile.Education = request.Education.Trim();
            profile.ExperienceSummary =
                request.ExperienceSummary.Trim();
            profile.UpdatedAt = DateTime.UtcNow;

            await _profileRepository.SaveChangesAsync();

            return MapToResponse(profile);
        }

        private static CandidateProfileResponseDto
            MapToResponse(CandidateProfile profile)
        {
            return new CandidateProfileResponseDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                FullName = profile.User.FullName,
                Email = profile.User.Email,
                Phone = profile.Phone,
                Location = profile.Location,
                Skills = profile.Skills,
                Education = profile.Education,
                ExperienceSummary =
                    profile.ExperienceSummary,
                ResumeUrl = profile.ResumeUrl,
                UpdatedAt = profile.UpdatedAt
            };
        }
    }
}