namespace TalentSyncAI.Api.DTOs.Candidates
{
    public class ResumeUploadResponseDto
    {
        public string FileName { get; set; } = string.Empty;

        public string DownloadUrl { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; }
    }
}