using Microsoft.AspNetCore.Identity;
using TalentSyncAI.Api.DTOs.Auth;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Models.Enums;
using TalentSyncAI.Api.Repositories.Interfaces;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasher<User> passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<RegisterResult> RegisterAsync(
            RegisterRequestDto request)
        {
            // Only Candidate and Recruiter can register themselves.
            if (request.Role != UserRole.Candidate &&
                request.Role != UserRole.Recruiter)
            {
                return new RegisterResult
                {
                    Succeeded = false,
                    Message =
                        "Only Candidate and Recruiter accounts can be self-registered.",
                    FailureReason = RegisterFailureReason.InvalidRole
                };
            }

            string normalizedEmail = request.Email
                .Trim()
                .ToLowerInvariant();

            bool emailExists =
                await _userRepository.EmailExistsAsync(normalizedEmail);

            if (emailExists)
            {
                return new RegisterResult
                {
                    Succeeded = false,
                    Message = "An account with this email already exists.",
                    FailureReason =
                        RegisterFailureReason.EmailAlreadyExists
                };
            }

            var user = new User
            {
                FullName = request.FullName.Trim(),
                Email = normalizedEmail,
                Role = request.Role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash =
                _passwordHasher.HashPassword(user, request.Password);

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return new RegisterResult
            {
                Succeeded = true,
                Message = "Registration successful.",
                FailureReason = RegisterFailureReason.None,
                User = new RegisterResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt
                }
            };
        }
    }
}