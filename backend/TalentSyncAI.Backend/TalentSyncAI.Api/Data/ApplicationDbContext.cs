using Microsoft.EntityFrameworkCore;
using TalentSyncAI.Api.Models.Entities;

namespace TalentSyncAI.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<CandidateProfile> CandidateProfiles { get; set; }

        public DbSet<RecruiterProfile> RecruiterProfiles { get; set; }

        public DbSet<Organization> Organizations { get; set; }

        public DbSet<Job> Jobs { get; set; }

        public DbSet<JobApplication> JobApplications { get; set; }

        public DbSet<Interview> Interviews { get; set; }

        public DbSet<Evaluation> Evaluations { get; set; }

        protected override void OnModelCreating(
            ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ------------------------------------------
            // User configuration
            // ------------------------------------------

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(user => user.Id);

                entity.Property(user => user.FullName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(user => user.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasIndex(user => user.Email)
                    .IsUnique();

                entity.Property(user => user.PasswordHash)
                    .IsRequired();

                entity.Property(user => user.Role)
                    .HasConversion<string>()
                    .HasMaxLength(30);

                entity.Property(user => user.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });

            // ------------------------------------------
            // Candidate profile configuration
            // ------------------------------------------

            modelBuilder.Entity<CandidateProfile>(entity =>
            {
                entity.HasKey(profile => profile.Id);

                entity.HasIndex(profile => profile.UserId)
                    .IsUnique();

                entity.Property(profile => profile.Phone)
                    .HasMaxLength(20);

                entity.Property(profile => profile.Location)
                    .HasMaxLength(150);

                entity.Property(profile => profile.Skills)
                    .HasMaxLength(2000);

                entity.Property(profile => profile.Education)
                    .HasMaxLength(2000);

                entity.Property(profile => profile.ExperienceSummary)
                    .HasMaxLength(4000);

                entity.Property(profile => profile.ResumeUrl)
                    .HasMaxLength(500);

                entity.Property(profile => profile.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(profile => profile.User)
                    .WithOne(user => user.CandidateProfile)
                    .HasForeignKey<CandidateProfile>(
                        profile => profile.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ------------------------------------------
            // Recruiter profile configuration
            // ------------------------------------------

            modelBuilder.Entity<RecruiterProfile>(entity =>
            {
                entity.HasKey(profile => profile.Id);

                entity.HasIndex(profile => profile.UserId)
                    .IsUnique();

                entity.Property(profile => profile.Phone)
                    .HasMaxLength(20);

                entity.Property(profile => profile.JobTitle)
                    .HasMaxLength(150);

                entity.Property(profile => profile.Location)
                    .HasMaxLength(150);

                entity.Property(profile => profile.ProfessionalSummary)
                    .HasMaxLength(3000);

                entity.Property(profile => profile.LinkedInUrl)
                    .HasMaxLength(500);

                entity.Property(profile => profile.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(profile => profile.User)
                    .WithOne(user => user.RecruiterProfile)
                    .HasForeignKey<RecruiterProfile>(
                        profile => profile.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ------------------------------------------
            // Organization configuration
            // ------------------------------------------

            modelBuilder.Entity<Organization>(entity =>
            {
                entity.HasKey(organization => organization.Id);

                entity.HasIndex(organization =>
                        organization.RecruiterUserId)
                    .IsUnique();

                entity.Property(organization => organization.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(organization => organization.Industry)
                    .HasMaxLength(150);

                entity.Property(organization => organization.Description)
                    .HasMaxLength(3000);

                entity.Property(organization => organization.Location)
                    .HasMaxLength(200);

                entity.Property(organization => organization.WebsiteUrl)
                    .HasMaxLength(500);

                entity.Property(organization => organization.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(organization => organization.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(organization => organization.RecruiterUser)
                    .WithOne(user => user.ManagedOrganization)
                    .HasForeignKey<Organization>(
                        organization => organization.RecruiterUserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ------------------------------------------
            // Job configuration
            // ------------------------------------------

            modelBuilder.Entity<Job>(entity =>
            {
                entity.HasKey(job => job.Id);

                entity.Property(job => job.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(job => job.Description)
                    .IsRequired()
                    .HasMaxLength(5000);

                entity.Property(job => job.RequiredSkills)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(job => job.Location)
                    .HasMaxLength(200);

                entity.Property(job => job.EmploymentType)
                    .HasMaxLength(100);

                entity.Property(job => job.ExperienceLevel)
                    .HasMaxLength(100);

                entity.Property(job => job.SalaryRange)
                    .HasMaxLength(100);

                entity.Property(job => job.Status)
                    .HasConversion<string>()
                    .HasMaxLength(30);

                entity.Property(job => job.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(job => job.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(job => job.Organization)
                    .WithMany(organization => organization.Jobs)
                    .HasForeignKey(job => job.OrganizationId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(job => job.RecruiterUser)
                    .WithMany(user => user.PostedJobs)
                    .HasForeignKey(job => job.RecruiterUserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ------------------------------------------
            // Job application configuration
            // ------------------------------------------

            modelBuilder.Entity<JobApplication>(entity =>
            {
                entity.HasKey(application => application.Id);

                entity.HasIndex(application => new
                {
                    application.JobId,
                    application.CandidateUserId
                }).IsUnique();

                entity.Property(application => application.CoverLetter)
                    .HasMaxLength(4000);

                entity.Property(application => application.Status)
                    .HasConversion<string>()
                    .HasMaxLength(30);

                entity.Property(application => application.AppliedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(application => application.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(application => application.Job)
                    .WithMany(job => job.Applications)
                    .HasForeignKey(application => application.JobId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(application => application.CandidateUser)
                    .WithMany(user => user.JobApplications)
                    .HasForeignKey(application => application.CandidateUserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            // ------------------------------------------
            // Interview configuration
            // ------------------------------------------

            modelBuilder.Entity<Interview>(entity =>
            {
                entity.HasKey(interview => interview.Id);

                entity.HasIndex(interview => interview.JobApplicationId);

                entity.Property(interview => interview.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(interview => interview.MeetingLink)
                    .HasMaxLength(500);

                entity.Property(interview => interview.Location)
                    .HasMaxLength(200);

                entity.Property(interview => interview.Notes)
                    .HasMaxLength(3000);

                entity.Property(interview => interview.Status)
                    .HasConversion<string>()
                    .HasMaxLength(30);

                entity.Property(interview => interview.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(interview => interview.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(interview => interview.JobApplication)
                    .WithMany(application => application.Interviews)
                    .HasForeignKey(interview => interview.JobApplicationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ------------------------------------------
            // Evaluation configuration
            // ------------------------------------------

            modelBuilder.Entity<Evaluation>(entity =>
            {
                entity.HasKey(evaluation => evaluation.Id);

                entity.HasIndex(evaluation =>
                    evaluation.JobApplicationId)
                    .IsUnique();

                entity.Property(evaluation =>
                    evaluation.OverallScore)
                    .HasPrecision(5, 2);

                entity.Property(evaluation =>
                    evaluation.Strengths)
                    .HasMaxLength(3000);

                entity.Property(evaluation =>
                    evaluation.Weaknesses)
                    .HasMaxLength(3000);

                entity.Property(evaluation =>
                    evaluation.Comments)
                    .HasMaxLength(5000);

                entity.Property(evaluation =>
                    evaluation.Decision)
                    .HasConversion<string>()
                    .HasMaxLength(40);

                entity.Property(evaluation =>
                    evaluation.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(evaluation =>
                    evaluation.UpdatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(evaluation =>
                        evaluation.JobApplication)
                    .WithOne(application =>
                        application.Evaluation)
                    .HasForeignKey<Evaluation>(evaluation =>
                        evaluation.JobApplicationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}