using TalentSyncAI.Api.DTOs.Auth;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<RegisterResult> RegisterAsync(
            RegisterRequestDto request);

        Task<LoginResult> LoginAsync(
            LoginRequestDto request);
    }
}