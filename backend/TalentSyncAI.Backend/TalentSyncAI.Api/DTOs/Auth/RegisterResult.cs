namespace TalentSyncAI.Api.DTOs.Auth
{
    public enum RegisterFailureReason
    {
        None,
        EmailAlreadyExists,
        InvalidRole
    }

    public class RegisterResult
    {
        public bool Succeeded { get; set; }

        public string Message { get; set; } = string.Empty;

        public RegisterFailureReason FailureReason { get; set; }

        public RegisterResponseDto? User { get; set; }
    }
}