namespace TalentSyncAI.Api.Helpers
{
    public class FileDownloadResult
    {
        public Stream FileStream { get; set; } = Stream.Null;

        public string ContentType { get; set; } =
            "application/octet-stream";

        public string DownloadFileName { get; set; } =
            string.Empty;
    }
}