using System;
using MRMS.Domain.Enums;

namespace MRMS.Application.DTOs
{
    public class UpdatePatientDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string Address { get; set; } = string.Empty;
        public string BloodGroup { get; set; } = string.Empty;
        public string EmergencyContact { get; set; } = string.Empty;
        public string MedicalHistorySummary { get; set; } = string.Empty;
    }

    public class PatientFilterDto
    {
        public string? SearchTerm { get; set; }
        public Gender? Gender { get; set; }
        public string? BloodGroup { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
