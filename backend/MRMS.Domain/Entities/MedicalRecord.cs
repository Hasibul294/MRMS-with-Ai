using System;

namespace MRMS.Domain.Entities
{
    public class MedicalRecord : BaseEntity
    {
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        public int? AppointmentId { get; set; }
        public Appointment? Appointment { get; set; }

        public string Diagnosis { get; set; } = string.Empty;
        public string ClinicalNotes { get; set; } = string.Empty;
        public string PrescriptionMedicines { get; set; } = string.Empty;
        public string VitalSigns { get; set; } = string.Empty; // BP, Temp, Pulse, etc.
        public bool IsLocked { get; set; } = true; // Immutable flag for non-admin users
    }
}
