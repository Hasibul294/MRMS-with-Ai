using System;
using MRMS.Domain.Enums;

namespace MRMS.Application.DTOs
{
    public class CreatePatientDto
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
}
