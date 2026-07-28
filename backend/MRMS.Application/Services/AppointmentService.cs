using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MRMS.Application.DTOs;
using MRMS.Application.Exceptions;
using MRMS.Application.Interfaces;
using MRMS.Domain.Entities;
using MRMS.Domain.Enums;

namespace MRMS.Application.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _appointmentRepo;
        private readonly ILogger<AppointmentService> _logger;

        public AppointmentService(IUnitOfWork unitOfWork, IAppointmentRepository appointmentRepo, ILogger<AppointmentService> logger)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _appointmentRepo = appointmentRepo ?? throw new ArgumentNullException(nameof(appointmentRepo));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<List<AppointmentDto>> GetAppointmentsAsync(AppointmentFilterDto filter, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Fetching appointments with filters.");
            var appointments = await _appointmentRepo.GetFilteredAsync(filter, cancellationToken);
            return appointments.Select(MapToDto).ToList();
        }

        public async Task<AppointmentDto> GetAppointmentByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var appointment = await _appointmentRepo.GetByIdAsync(id, cancellationToken);
            if (appointment == null) throw new NotFoundException(nameof(Appointment), id);
            return MapToDto(appointment);
        }

        public async Task<AppointmentDto> BookAppointmentAsync(CreateAppointmentDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Attempting to book appointment for Patient {PatientId} with Doctor {DoctorId} at {Time}", dto.PatientId, dto.DoctorId, dto.AppointmentDateTime);

            if (dto.AppointmentDateTime < DateTime.UtcNow.AddMinutes(-5))
            {
                throw new BadRequestException("Cannot schedule an appointment in the past.");
            }

            // Check duplicate booking slot for Doctor
            var isSlotTaken = await _appointmentRepo.ExistsByDoctorAndSlotAsync(dto.DoctorId, dto.AppointmentDateTime, cancellationToken: cancellationToken);
            if (isSlotTaken)
            {
                _logger.LogWarning("Appointment slot collision for Doctor {DoctorId} at {Time}", dto.DoctorId, dto.AppointmentDateTime);
                throw new ConflictException($"The selected doctor already has a booked appointment slot at {dto.AppointmentDateTime:yyyy-MM-dd HH:mm}. Please select a different time slot.");
            }

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                AppointmentDateTime = dto.AppointmentDateTime,
                ReasonForVisit = dto.ReasonForVisit.Trim(),
                Notes = dto.Notes.Trim(),
                Status = AppointmentStatus.Scheduled,
                CreatedAt = DateTime.UtcNow
            };

            await _appointmentRepo.AddAsync(appointment, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully booked appointment ID {AppointmentId}", appointment.Id);
            return MapToDto(appointment);
        }

        public async Task<AppointmentDto> RescheduleAppointmentAsync(int id, RescheduleAppointmentDto dto, CancellationToken cancellationToken = default)
        {
            var appointment = await _appointmentRepo.GetByIdAsync(id, cancellationToken);
            if (appointment == null) throw new NotFoundException(nameof(Appointment), id);

            if (dto.NewAppointmentDateTime < DateTime.UtcNow.AddMinutes(-5))
            {
                throw new BadRequestException("New appointment date and time cannot be in the past.");
            }

            var isSlotTaken = await _appointmentRepo.ExistsByDoctorAndSlotAsync(appointment.DoctorId, dto.NewAppointmentDateTime, excludeId: id, cancellationToken: cancellationToken);
            if (isSlotTaken)
            {
                throw new ConflictException($"The doctor is unavailable at {dto.NewAppointmentDateTime:yyyy-MM-dd HH:mm} due to an existing booking.");
            }

            appointment.AppointmentDateTime = dto.NewAppointmentDateTime;
            appointment.UpdatedAt = DateTime.UtcNow;
            if (!string.IsNullOrWhiteSpace(dto.Reason))
            {
                appointment.Notes = $"{appointment.Notes} [Rescheduled: {dto.Reason}]".Trim();
            }

            _appointmentRepo.Update(appointment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return MapToDto(appointment);
        }

        public async Task<AppointmentDto> CancelAppointmentAsync(int id, CancellationToken cancellationToken = default)
        {
            var appointment = await _appointmentRepo.GetByIdAsync(id, cancellationToken);
            if (appointment == null) throw new NotFoundException(nameof(Appointment), id);

            appointment.Status = AppointmentStatus.Cancelled;
            appointment.UpdatedAt = DateTime.UtcNow;

            _appointmentRepo.Update(appointment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return MapToDto(appointment);
        }

        private static AppointmentDto MapToDto(Appointment a)
        {
            return new AppointmentDto
            {
                Id = a.Id,
                PatientId = a.PatientId,
                PatientName = a.Patient?.FullName ?? $"Patient #{a.PatientId}",
                PatientCode = a.Patient?.PatientCode ?? string.Empty,
                PatientPhone = a.Patient?.Phone ?? string.Empty,
                DoctorId = a.DoctorId,
                DoctorName = a.Doctor?.FullName ?? $"Doctor #{a.DoctorId}",
                DoctorSpecialization = a.Doctor?.Specialization ?? string.Empty,
                AppointmentDateTime = a.AppointmentDateTime,
                Status = a.Status,
                ReasonForVisit = a.ReasonForVisit,
                Notes = a.Notes,
                CreatedAt = a.CreatedAt
            };
        }
    }
}
