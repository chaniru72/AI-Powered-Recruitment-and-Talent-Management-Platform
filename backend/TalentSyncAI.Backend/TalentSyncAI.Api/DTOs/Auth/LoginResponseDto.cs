using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.DTOs.Auth
{
    public class LoginResponseDto
    {
        public int UserId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public UserRole Role { get; set; }

        public string AccessToken { get; set; } = string.Empty;

        public string TokenType { get; set; } = "Bearer";

        public DateTime ExpiresAt { get; set; }
    }
}