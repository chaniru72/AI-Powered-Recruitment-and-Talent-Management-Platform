namespace TalentSyncAI.Api.DTOs.Candidates
{
    public class ResumeUploadResult
    {
        public bool Succeeded { get; set; }

        public string Message { get; set; } = string.Empty;

        public ResumeUploadResponseDto? Data { get; set; }
    }
}