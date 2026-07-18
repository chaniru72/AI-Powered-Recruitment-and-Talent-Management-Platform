namespace TalentSyncAI.Api.Helpers
{
    public class FileSaveResult
    {
        public bool Succeeded { get; set; }

        public string Message { get; set; } = string.Empty;

        public string StoredFileName { get; set; } = string.Empty;

        public string OriginalFileName { get; set; } = string.Empty;

        public string ContentType { get; set; } =
            "application/octet-stream";
    }
}