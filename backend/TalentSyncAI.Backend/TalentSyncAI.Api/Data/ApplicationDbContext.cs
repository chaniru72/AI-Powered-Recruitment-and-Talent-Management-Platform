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
        }
    }
}