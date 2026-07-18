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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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
        }
    }
}