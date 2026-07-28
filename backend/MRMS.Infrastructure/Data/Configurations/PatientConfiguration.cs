using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MRMS.Domain.Entities;

namespace MRMS.Infrastructure.Data.Configurations
{
    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.ToTable("Patients");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.PatientCode)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(p => p.FullName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.Phone)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(p => p.Email)
                .HasMaxLength(100);

            builder.Property(p => p.Address)
                .HasMaxLength(250);

            builder.Property(p => p.BloodGroup)
                .HasMaxLength(10);

            // Database Indexes
            builder.HasIndex(p => p.Phone)
                .IsUnique()
                .HasDatabaseName("IX_Patients_Phone");

            builder.HasIndex(p => p.PatientCode)
                .IsUnique()
                .HasDatabaseName("IX_Patients_PatientCode");
        }
    }
}
