using System;
using MRMS.Domain.Enums;

namespace MRMS.Application.DTOs
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string PatientCode { get; set; } = string.Empty;
        public string PatientPhone { get; set; } = string.Empty;
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string DoctorSpecialization { get; set; } = string.Empty;
        public DateTime AppointmentDateTime { get; set; }
        public AppointmentStatus Status { get; set; }
        public string StatusName => Status.ToString();
        public string ReasonForVisit { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateAppointmentDto
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string ReasonForVisit { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class RescheduleAppointmentDto
    {
        public DateTime NewAppointmentDateTime { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class AppointmentFilterDto
    {
        public int? PatientId { get; set; }
        public int? DoctorId { get; set; }
        public DateTime? Date { get; set; }
        public AppointmentStatus? Status { get; set; }
        public string? SearchTerm { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
