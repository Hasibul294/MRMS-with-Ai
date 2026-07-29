using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MRMS.Domain.Entities;
using MRMS.Domain.Enums;

namespace MRMS.Infrastructure.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Seed Doctors if empty
            if (!await context.Doctors.AnyAsync())
            {
                var doctors = new[]
                {
                    new Doctor
                    {
                        FullName = "Dr. Sarah Jenkins",
                        Specialization = "Cardiology",
                        Phone = "+15550001111",
                        Email = "sarah.j@mrms.org",
                        LicenseNumber = "MED-8821",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Doctor
                    {
                        FullName = "Dr. Marcus Vance",
                        Specialization = "Endocrinology",
                        Phone = "+15550002222",
                        Email = "marcus.v@mrms.org",
                        LicenseNumber = "MED-9932",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Doctor
                    {
                        FullName = "Dr. Emily Watson",
                        Specialization = "Pediatrics",
                        Phone = "+15550003333",
                        Email = "emily.w@mrms.org",
                        LicenseNumber = "MED-4412",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Doctor
                    {
                        FullName = "Dr. Alexander Hayes",
                        Specialization = "Neurology",
                        Phone = "+15550004444",
                        Email = "alex.h@mrms.org",
                        LicenseNumber = "MED-5509",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Doctors.AddRangeAsync(doctors);
                await context.SaveChangesAsync();
            }

            // Seed Initial Patients if empty
            if (!await context.Patients.AnyAsync())
            {
                var patients = new[]
                {
                    new Patient
                    {
                        PatientCode = "PAT-202607-1001",
                        FullName = "Eleanor Vance",
                        Phone = "+15550192834",
                        Email = "eleanor.vance@example.com",
                        DateOfBirth = new DateTime(1992, 4, 12),
                        Gender = Gender.Female,
                        Address = "742 Evergreen Terrace, Springfield",
                        BloodGroup = "O+",
                        EmergencyContact = "+15559876543 (Husband)",
                        MedicalHistorySummary = "Mild asthma, penicillin allergy.",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Patient
                    {
                        PatientCode = "PAT-202607-1002",
                        FullName = "Robert Sterling",
                        Phone = "+15550183726",
                        Email = "robert.sterling@example.com",
                        DateOfBirth = new DateTime(1978, 11, 25),
                        Gender = Gender.Male,
                        Address = "100 Baker Street, London",
                        BloodGroup = "A+",
                        EmergencyContact = "+15558765432 (Wife)",
                        MedicalHistorySummary = "Type 2 Diabetes mellitus under medication.",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Patient
                    {
                        PatientCode = "PAT-202607-1003",
                        FullName = "Sophia Martinez",
                        Phone = "+15550174625",
                        Email = "sophia.m@example.com",
                        DateOfBirth = new DateTime(2001, 8, 5),
                        Gender = Gender.Female,
                        Address = "456 Ocean Drive, Miami",
                        BloodGroup = "B+",
                        EmergencyContact = "+15557654321 (Mother)",
                        MedicalHistorySummary = "No major medical history recorded.",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Patients.AddRangeAsync(patients);
                await context.SaveChangesAsync();
            }
        }
    }
}
