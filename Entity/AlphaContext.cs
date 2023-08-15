using Microsoft.EntityFrameworkCore;

namespace AlphaAuthentication.Entity
{
    public class AlphaContext : DbContext
    {
        public AlphaContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Authentication> Authentication { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Authentication>().ToTable("Authentication");

            modelBuilder.Entity<Authentication>(x =>
            {
                x.HasKey(c => c.Id).HasName("PK_Authentication_Id");

                x.Property(c => c.FirstName).HasColumnType("varchar(100)").IsRequired();
                x.Property(c => c.LastName).HasColumnType("varchar(100)").IsRequired();
                x.Property(c => c.DateOfBirth).HasColumnType("date").IsRequired();
                x.Property(c => c.BPOId).HasColumnType("int").IsRequired();
                x.Property(c => c.LeadId).HasColumnType("bigint").IsRequired();
                x.Property(c => c.SourceUrl).HasColumnType("varchar(500)").IsRequired(true);
                x.Property(c => c.EmailAddress).HasColumnType("varchar(250)").IsRequired(false);
                x.Property(c => c.MobileNumber).HasColumnType("varchar(20)").IsRequired(false);
                x.Property(c => c.CreatedOn).HasColumnType("datetime").IsRequired();
                x.Property(c => c.IP).HasColumnType("varchar(50)").IsRequired();
            });
        }
    }
}
