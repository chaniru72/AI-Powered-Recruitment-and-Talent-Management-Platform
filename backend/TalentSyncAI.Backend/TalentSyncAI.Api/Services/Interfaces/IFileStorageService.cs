using TalentSyncAI.Api.Helpers;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface IFileStorageService
    {
        Task<FileSaveResult> SaveResumeAsync(
            IFormFile file,
            int userId,
            CancellationToken cancellationToken = default);

        Task<FileDownloadResult?> OpenResumeAsync(
            string storedFileName,
            CancellationToken cancellationToken = default);

        Task DeleteResumeAsync(
            string storedFileName);
    }
}