using System;
using MRMS.Domain.Enums;

namespace MRMS.Domain.Entities
{
    public class Appointment : BaseEntity
    {
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        public DateTime AppointmentDateTime { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
        public string ReasonForVisit { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}
