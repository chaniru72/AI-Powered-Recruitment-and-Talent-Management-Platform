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
        private readonly ITokenService _tokenService;

        public AuthService(
            IUserRepository userRepository,
            IPasswordHasher<User> passwordHasher,
            ITokenService tokenService)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        public async Task<RegisterResult> RegisterAsync(
            RegisterRequestDto request)
        {
            if (request.Role != UserRole.Candidate &&
                request.Role != UserRole.Recruiter)
            {
                return new RegisterResult
                {
                    Succeeded = false,
                    Message =
                        "Only Candidate and Recruiter accounts can be self-registered.",
                    FailureReason =
                        RegisterFailureReason.InvalidRole
                };
            }

            string normalizedEmail = request.Email
                .Trim()
                .ToLowerInvariant();

            bool emailExists =
                await _userRepository.EmailExistsAsync(
                    normalizedEmail);

            if (emailExists)
            {
                return new RegisterResult
                {
                    Succeeded = false,
                    Message =
                        "An account with this email already exists.",
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
                _passwordHasher.HashPassword(
                    user,
                    request.Password);

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

        public async Task<LoginResult> LoginAsync(
            LoginRequestDto request)
        {
            string normalizedEmail = request.Email
                .Trim()
                .ToLowerInvariant();

            User? user =
                await _userRepository.GetByEmailAsync(
                    normalizedEmail);

            if (user is null)
            {
                return InvalidCredentialsResult();
            }

            if (!user.IsActive)
            {
                return new LoginResult
                {
                    Succeeded = false,
                    Message =
                        "This account has been deactivated.",
                    FailureReason =
                        LoginFailureReason.InactiveAccount
                };
            }

            PasswordVerificationResult verificationResult =
                _passwordHasher.VerifyHashedPassword(
                    user,
                    user.PasswordHash,
                    request.Password);

            if (verificationResult ==
                PasswordVerificationResult.Failed)
            {
                return InvalidCredentialsResult();
            }

            if (verificationResult ==
                PasswordVerificationResult.SuccessRehashNeeded)
            {
                user.PasswordHash =
                    _passwordHasher.HashPassword(
                        user,
                        request.Password);

                await _userRepository.SaveChangesAsync();
            }

            TokenResult tokenResult =
                _tokenService.CreateToken(user);

            return new LoginResult
            {
                Succeeded = true,
                Message = "Login successful.",
                FailureReason = LoginFailureReason.None,
                Data = new LoginResponseDto
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    AccessToken = tokenResult.AccessToken,
                    TokenType = "Bearer",
                    ExpiresAt = tokenResult.ExpiresAt
                }
            };
        }

        private static LoginResult InvalidCredentialsResult()
        {
            return new LoginResult
            {
                Succeeded = false,
                Message = "Invalid email or password.",
                FailureReason =
                    LoginFailureReason.InvalidCredentials
            };
        }
    }
}