using System;

namespace MRMS.Application.DTOs
{
    public class MedicalRecordDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string PatientCode { get; set; } = string.Empty;
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public int? AppointmentId { get; set; }
        public string Diagnosis { get; set; } = string.Empty;
        public string ClinicalNotes { get; set; } = string.Empty;
        public string PrescriptionMedicines { get; set; } = string.Empty;
        public string VitalSigns { get; set; } = string.Empty;
        public bool IsLocked { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateMedicalRecordDto
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int? AppointmentId { get; set; }
        public string Diagnosis { get; set; } = string.Empty;
        public string ClinicalNotes { get; set; } = string.Empty;
        public string PrescriptionMedicines { get; set; } = string.Empty;
        public string VitalSigns { get; set; } = string.Empty;
    }

    public class UpdateMedicalRecordDto
    {
        public string Diagnosis { get; set; } = string.Empty;
        public string ClinicalNotes { get; set; } = string.Empty;
        public string PrescriptionMedicines { get; set; } = string.Empty;
        public string VitalSigns { get; set; } = string.Empty;
        public string UserRole { get; set; } = string.Empty; // Enforces Admin check
    }
}
