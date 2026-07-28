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

namespace MRMS.Application.Services
{
    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMedicalRecordRepository _recordRepo;
        private readonly ILogger<MedicalRecordService> _logger;

        public MedicalRecordService(IUnitOfWork unitOfWork, IMedicalRecordRepository recordRepo, ILogger<MedicalRecordService> logger)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _recordRepo = recordRepo ?? throw new ArgumentNullException(nameof(recordRepo));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<List<MedicalRecordDto>> GetMedicalRecordsAsync(int? patientId = null, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving medical records. Filter patientId: {PatientId}", patientId);
            List<MedicalRecord> list;
            if (patientId.HasValue)
            {
                list = await _recordRepo.GetByPatientIdAsync(patientId.Value, cancellationToken);
            }
            else
            {
                // Fallback for general query
                list = await _recordRepo.GetByPatientIdAsync(0, cancellationToken);
            }
            return list.Select(MapToDto).ToList();
        }

        public async Task<MedicalRecordDto> GetMedicalRecordByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var record = await _recordRepo.GetByIdAsync(id, cancellationToken);
            if (record == null) throw new NotFoundException(nameof(MedicalRecord), id);
            return MapToDto(record);
        }

        public async Task<MedicalRecordDto> CreateMedicalRecordAsync(CreateMedicalRecordDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Creating new clinical medical record for Patient {PatientId} by Doctor {DoctorId}", dto.PatientId, dto.DoctorId);

            var record = new MedicalRecord
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                AppointmentId = dto.AppointmentId,
                Diagnosis = dto.Diagnosis.Trim(),
                ClinicalNotes = dto.ClinicalNotes.Trim(),
                PrescriptionMedicines = dto.PrescriptionMedicines.Trim(),
                VitalSigns = dto.VitalSigns.Trim(),
                IsLocked = true,
                CreatedAt = DateTime.UtcNow
            };

            await _recordRepo.AddAsync(record, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created clinical record ID {RecordId}", record.Id);
            return MapToDto(record);
        }

        public async Task<MedicalRecordDto> UpdateMedicalRecordAsync(int id, UpdateMedicalRecordDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Attempting to update medical record ID {RecordId} with role {Role}", id, dto.UserRole);

            var record = await _recordRepo.GetByIdAsync(id, cancellationToken);
            if (record == null) throw new NotFoundException(nameof(MedicalRecord), id);

            // Role validation: Non-admin users cannot edit existing records (HTTP 403 Forbidden)
            if (!string.Equals(dto.UserRole, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Unauthorized modification attempt on record ID {RecordId} by role {Role}", id, dto.UserRole);
                throw new CustomForbiddenException("Unauthorized: Only users with the Admin role can modify clinical records once created.");
            }

            record.Diagnosis = dto.Diagnosis.Trim();
            record.ClinicalNotes = dto.ClinicalNotes.Trim();
            record.PrescriptionMedicines = dto.PrescriptionMedicines.Trim();
            record.VitalSigns = dto.VitalSigns.Trim();
            record.UpdatedAt = DateTime.UtcNow;

            _recordRepo.Update(record);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return MapToDto(record);
        }

        private static MedicalRecordDto MapToDto(MedicalRecord r)
        {
            return new MedicalRecordDto
            {
                Id = r.Id,
                PatientId = r.PatientId,
                PatientName = r.Patient?.FullName ?? $"Patient #{r.PatientId}",
                PatientCode = r.Patient?.PatientCode ?? string.Empty,
                DoctorId = r.DoctorId,
                DoctorName = r.Doctor?.FullName ?? $"Doctor #{r.DoctorId}",
                AppointmentId = r.AppointmentId,
                Diagnosis = r.Diagnosis,
                ClinicalNotes = r.ClinicalNotes,
                PrescriptionMedicines = r.PrescriptionMedicines,
                VitalSigns = r.VitalSigns,
                IsLocked = r.IsLocked,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt
            };
        }
    }

    public class CustomForbiddenException : CustomException
    {
        public CustomForbiddenException(string message) : base(message, 403) { }
    }
}
