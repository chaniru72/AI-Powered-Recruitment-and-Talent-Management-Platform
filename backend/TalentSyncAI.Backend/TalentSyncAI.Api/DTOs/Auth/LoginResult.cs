namespace TalentSyncAI.Api.DTOs.Auth
{
    public enum LoginFailureReason
    {
        None,
        InvalidCredentials,
        InactiveAccount
    }

    public class LoginResult
    {
        public bool Succeeded { get; set; }

        public string Message { get; set; } = string.Empty;

        public LoginFailureReason FailureReason { get; set; }

        public LoginResponseDto? Data { get; set; }
    }
}