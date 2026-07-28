using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MRMS.Domain.Entities;

namespace MRMS.Infrastructure.Data.Configurations
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.ToTable("Appointments");

            builder.HasKey(a => a.Id);

            builder.Property(a => a.ReasonForVisit)
                .HasMaxLength(250);

            // Foreign Keys
            builder.HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(a => a.PatientId)
                .HasDatabaseName("IX_Appointments_PatientId");

            builder.HasIndex(a => a.DoctorId)
                .HasDatabaseName("IX_Appointments_DoctorId");

            builder.HasIndex(a => a.AppointmentDateTime)
                .HasDatabaseName("IX_Appointments_AppointmentDateTime");

            // Unique Constraint: Doctor + AppointmentDateTime
            builder.HasIndex(a => new { a.DoctorId, a.AppointmentDateTime })
                .IsUnique()
                .HasDatabaseName("IX_Appointments_Doctor_DateTime_Unique");
        }
    }
}
