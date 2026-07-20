using TalentSyncAI.Api.Models.Enums;

namespace TalentSyncAI.Api.Models.Entities
{
    public class JobApplication
    {
        public int Id { get; set; }

        public int JobId { get; set; }

        public int CandidateUserId { get; set; }

        public string CoverLetter { get; set; } = string.Empty;

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Job Job { get; set; } = null!;

        public User CandidateUser { get; set; } = null!;

        public ICollection<Interview> Interviews { get; set; }
    = new List<Interview>();

        public Evaluation? Evaluation { get; set; }
    }
}