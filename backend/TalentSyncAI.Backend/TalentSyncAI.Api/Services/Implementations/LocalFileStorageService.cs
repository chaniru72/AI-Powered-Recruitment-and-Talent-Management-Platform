using TalentSyncAI.Api.Helpers;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class LocalFileStorageService : IFileStorageService
    {
        private const long MaximumResumeSize =
            5 * 1024 * 1024;

        private static readonly HashSet<string>
            AllowedExtensions =
                new(StringComparer.OrdinalIgnoreCase)
                {
                    ".pdf",
                    ".doc",
                    ".docx"
                };

        private static readonly Dictionary<string, string>
            ContentTypes =
                new(StringComparer.OrdinalIgnoreCase)
                {
                    [".pdf"] = "application/pdf",
                    [".doc"] = "application/msword",
                    [".docx"] =
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                };

        private readonly string _resumeDirectory;

        public LocalFileStorageService(
            IWebHostEnvironment environment)
        {
            _resumeDirectory = Path.Combine(
                environment.ContentRootPath,
                "Storage",
                "Resumes");

            Directory.CreateDirectory(
                _resumeDirectory);
        }

        public async Task<FileSaveResult> SaveResumeAsync(
            IFormFile file,
            int userId,
            CancellationToken cancellationToken = default)
        {
            if (file.Length == 0)
            {
                return Failed(
                    "The selected resume file is empty.");
            }

            if (file.Length > MaximumResumeSize)
            {
                return Failed(
                    "The resume cannot exceed 5 MB.");
            }

            string extension =
                Path.GetExtension(file.FileName)
                    .ToLowerInvariant();

            if (!AllowedExtensions.Contains(extension))
            {
                return Failed(
                    "Only PDF, DOC and DOCX files are allowed.");
            }

            string storedFileName =
                $"candidate_{userId}_" +
                $"{Guid.NewGuid():N}{extension}";

            string fullPath = Path.Combine(
                _resumeDirectory,
                storedFileName);

            await using FileStream fileStream =
                new(
                    fullPath,
                    FileMode.CreateNew,
                    FileAccess.Write,
                    FileShare.None);

            await file.CopyToAsync(
                fileStream,
                cancellationToken);

            return new FileSaveResult
            {
                Succeeded = true,
                Message = "Resume saved successfully.",
                StoredFileName = storedFileName,
                OriginalFileName =
                    Path.GetFileName(file.FileName),
                ContentType =
                    ContentTypes[extension]
            };
        }

        public Task<FileDownloadResult?> OpenResumeAsync(
            string storedFileName,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(storedFileName))
            {
                return Task.FromResult<
                    FileDownloadResult?>(null);
            }

            if (Path.GetFileName(storedFileName)
                != storedFileName)
            {
                return Task.FromResult<
                    FileDownloadResult?>(null);
            }

            string fullPath = Path.Combine(
                _resumeDirectory,
                storedFileName);

            if (!File.Exists(fullPath))
            {
                return Task.FromResult<
                    FileDownloadResult?>(null);
            }

            string extension =
                Path.GetExtension(storedFileName);

            string contentType =
                ContentTypes.TryGetValue(
                    extension,
                    out string? value)
                    ? value
                    : "application/octet-stream";

            Stream stream = new FileStream(
                fullPath,
                FileMode.Open,
                FileAccess.Read,
                FileShare.Read);

            FileDownloadResult result = new()
            {
                FileStream = stream,
                ContentType = contentType,
                DownloadFileName =
                    $"CandidateResume{extension}"
            };

            return Task.FromResult<
                FileDownloadResult?>(result);
        }

        public Task DeleteResumeAsync(
            string storedFileName)
        {
            if (string.IsNullOrWhiteSpace(storedFileName))
            {
                return Task.CompletedTask;
            }

            if (Path.GetFileName(storedFileName)
                != storedFileName)
            {
                return Task.CompletedTask;
            }

            string fullPath = Path.Combine(
                _resumeDirectory,
                storedFileName);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            return Task.CompletedTask;
        }

        private static FileSaveResult Failed(
            string message)
        {
            return new FileSaveResult
            {
                Succeeded = false,
                Message = message
            };
        }
    }
}