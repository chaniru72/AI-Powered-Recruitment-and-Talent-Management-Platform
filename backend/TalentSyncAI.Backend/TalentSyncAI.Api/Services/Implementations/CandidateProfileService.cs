using TalentSyncAI.Api.DTOs.Candidates;
using TalentSyncAI.Api.Helpers;
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

        private readonly IFileStorageService
            _fileStorageService;

        public CandidateProfileService(
            ICandidateProfileRepository profileRepository,
            IUserRepository userRepository,
            IFileStorageService fileStorageService)
        {
            _profileRepository = profileRepository;
            _userRepository = userRepository;
            _fileStorageService = fileStorageService;
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

        public async Task<ResumeUploadResult>
            UploadResumeAsync(
                int userId,
                IFormFile file,
                CancellationToken cancellationToken = default)
        {
            CandidateProfile? profile =
                await _profileRepository
                    .GetByUserIdAsync(userId);

            if (profile is null)
            {
                return new ResumeUploadResult
                {
                    Succeeded = false,
                    Message =
                        "Create your Candidate profile before uploading a resume."
                };
            }

            FileSaveResult fileSaveResult =
                await _fileStorageService.SaveResumeAsync(
                    file,
                    userId,
                    cancellationToken);

            if (!fileSaveResult.Succeeded)
            {
                return new ResumeUploadResult
                {
                    Succeeded = false,
                    Message = fileSaveResult.Message
                };
            }

            string? previousResume =
                profile.ResumeUrl;

            profile.ResumeUrl =
                fileSaveResult.StoredFileName;

            profile.UpdatedAt =
                DateTime.UtcNow;

            try
            {
                await _profileRepository
                    .SaveChangesAsync();
            }
            catch
            {
                await _fileStorageService
                    .DeleteResumeAsync(
                        fileSaveResult.StoredFileName);

                throw;
            }

            if (!string.IsNullOrWhiteSpace(
                    previousResume) &&
                previousResume !=
                    fileSaveResult.StoredFileName)
            {
                await _fileStorageService
                    .DeleteResumeAsync(previousResume);
            }

            return new ResumeUploadResult
            {
                Succeeded = true,
                Message =
                    "Resume uploaded successfully.",
                Data = new ResumeUploadResponseDto
                {
                    FileName =
                        fileSaveResult.OriginalFileName,

                    DownloadUrl =
                        "/api/candidates/me/resume",

                    UploadedAt =
                        profile.UpdatedAt
                }
            };
        }

        public async Task<FileDownloadResult?>
            GetMyResumeAsync(
                int userId,
                CancellationToken cancellationToken = default)
        {
            CandidateProfile? profile =
                await _profileRepository
                    .GetByUserIdAsync(userId);

            if (profile is null ||
                string.IsNullOrWhiteSpace(
                    profile.ResumeUrl))
            {
                return null;
            }

            return await _fileStorageService
                .OpenResumeAsync(
                    profile.ResumeUrl,
                    cancellationToken);
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