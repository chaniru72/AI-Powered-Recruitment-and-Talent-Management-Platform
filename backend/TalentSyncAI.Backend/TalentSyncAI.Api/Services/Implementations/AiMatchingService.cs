using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Data;
using TalentSyncAI.Api.DTOs.AI;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class AiMatchingService : IAiMatchingService
    {
        private readonly ApplicationDbContext _context;

        public AiMatchingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<CandidateMatchResponseDto>>
            GetMatchesForJobAsync(
                int jobId,
                int recruiterUserId)
        {
            var job = await _context.Jobs
                .Include(job => job.Applications)
                    .ThenInclude(application =>
                        application.CandidateUser)
                    .ThenInclude(user =>
                        user.CandidateProfile)
                .FirstOrDefaultAsync(job => job.Id == jobId);

            if (job == null)
            {
                throw new KeyNotFoundException(
                    "Job not found.");
            }

            if (job.RecruiterUserId != recruiterUserId)
            {
                throw new UnauthorizedAccessException(
                    "You do not have permission to view matches for this job.");
            }

            var requiredSkills = ParseSkills(
                job.RequiredSkills);

            var results =
                new List<CandidateMatchResponseDto>();

            foreach (var application in job.Applications)
            {
                var candidate = application.CandidateUser;

                var candidateSkills = ParseSkills(
                    candidate.CandidateProfile?.Skills);

                var matchedSkills = requiredSkills
                    .Where(requiredSkill =>
                        candidateSkills.Any(candidateSkill =>
                            string.Equals(
                                requiredSkill,
                                candidateSkill,
                                StringComparison.OrdinalIgnoreCase)))
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList();

                var missingSkills = requiredSkills
                    .Except(
                        matchedSkills,
                        StringComparer.OrdinalIgnoreCase)
                    .ToList();

                double matchScore = requiredSkills.Count == 0
                    ? 0
                    : Math.Round(
                        matchedSkills.Count * 100.0
                        / requiredSkills.Count,
                        2);

                results.Add(
                    new CandidateMatchResponseDto
                    {
                        ApplicationId = application.Id,

                        CandidateUserId = candidate.Id,

                        CandidateName =
                            candidate.FullName,

                        CandidateEmail =
                            candidate.Email,

                        JobId = job.Id,

                        JobTitle = job.Title,

                        MatchScore = matchScore,

                        MatchedSkills = matchedSkills,

                        MissingSkills = missingSkills,

                        Recommendation =
                            CreateRecommendation(matchScore)
                    });
            }

            return results
                .OrderByDescending(result =>
                    result.MatchScore)
                .ToList();
        }

        private static List<string> ParseSkills(
            string? skills)
        {
            if (string.IsNullOrWhiteSpace(skills))
            {
                return new List<string>();
            }

            char[] separators =
            {
                ',',
                ';',
                '|',
                '\n',
                '\r'
            };

            return skills
                .Split(
                    separators,
                    StringSplitOptions.RemoveEmptyEntries)
                .Select(skill => skill.Trim())
                .Where(skill =>
                    !string.IsNullOrWhiteSpace(skill))
                .Distinct(
                    StringComparer.OrdinalIgnoreCase)
                .ToList();
        }

        private static string CreateRecommendation(
            double matchScore)
        {
            if (matchScore >= 80)
            {
                return "Excellent match for this job.";
            }

            if (matchScore >= 60)
            {
                return "Good match for this job.";
            }

            if (matchScore >= 40)
            {
                return "Moderate match. Some required skills are missing.";
            }

            if (matchScore > 0)
            {
                return "Low match. The candidate needs more required skills.";
            }

            return "No required skills currently match this job.";
        }
    }
}