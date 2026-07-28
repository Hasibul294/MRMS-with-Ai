using System;
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
    public class PatientService : IPatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<PatientService> _logger;

        public PatientService(IUnitOfWork unitOfWork, ILogger<PatientService> logger)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<PagedResultDto<PatientDto>> GetPatientsAsync(PatientFilterDto filter, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving paginated patients list for page {PageNumber}, size {PageSize}", filter.PageNumber, filter.PageSize);
            
            var pagedEntities = await _unitOfWork.Patients.GetPagedAsync(filter, cancellationToken);

            var items = pagedEntities.Items.Select(MapToDto).ToList();

            return new PagedResultDto<PatientDto>
            {
                Items = items,
                TotalCount = pagedEntities.TotalCount,
                PageNumber = pagedEntities.PageNumber,
                PageSize = pagedEntities.PageSize
            };
        }

        public async Task<PatientDto> GetPatientByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Retrieving patient by ID: {PatientId}", id);
            
            var patient = await _unitOfWork.Patients.GetByIdAsync(id, cancellationToken);
            if (patient == null)
            {
                _logger.LogWarning("Patient not found with ID: {PatientId}", id);
                throw new NotFoundException(nameof(Patient), id);
            }

            return MapToDto(patient);
        }

        public async Task<PatientDto> CreatePatientAsync(CreatePatientDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Attempting to create new patient with phone: {Phone}", dto.Phone);

            // Business rule: Patient phone must be unique
            var phoneExists = await _unitOfWork.Patients.ExistsByPhoneAsync(dto.Phone, cancellationToken: cancellationToken);
            if (phoneExists)
            {
                _logger.LogWarning("Patient creation failed due to duplicate phone number: {Phone}", dto.Phone);
                throw new ConflictException($"A patient with phone number '{dto.Phone}' already exists.");
            }

            var patient = new Patient
            {
                PatientCode = $"PAT-{DateTime.UtcNow:yyyyMM}-{Random.Shared.Next(1000, 9999)}",
                FullName = dto.FullName.Trim(),
                Phone = dto.Phone.Trim(),
                Email = dto.Email.Trim(),
                DateOfBirth = dto.DateOfBirth.Date,
                Gender = dto.Gender,
                Address = dto.Address.Trim(),
                BloodGroup = dto.BloodGroup.Trim(),
                EmergencyContact = dto.EmergencyContact.Trim(),
                MedicalHistorySummary = dto.MedicalHistorySummary.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Patients.AddAsync(patient, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully created patient with ID {PatientId} and code {PatientCode}", patient.Id, patient.PatientCode);
            return MapToDto(patient);
        }

        public async Task<PatientDto> UpdatePatientAsync(int id, UpdatePatientDto dto, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Attempting to update patient with ID: {PatientId}", id);

            var patient = await _unitOfWork.Patients.GetByIdAsync(id, cancellationToken);
            if (patient == null)
            {
                _logger.LogWarning("Patient update failed. Patient not found with ID: {PatientId}", id);
                throw new NotFoundException(nameof(Patient), id);
            }

            // Check phone uniqueness if phone is changing
            if (!string.Equals(patient.Phone, dto.Phone, StringComparison.OrdinalIgnoreCase))
            {
                var phoneExists = await _unitOfWork.Patients.ExistsByPhoneAsync(dto.Phone, excludeId: id, cancellationToken: cancellationToken);
                if (phoneExists)
                {
                    _logger.LogWarning("Patient update failed due to duplicate phone number: {Phone}", dto.Phone);
                    throw new ConflictException($"A patient with phone number '{dto.Phone}' already exists.");
                }
            }

            patient.FullName = dto.FullName.Trim();
            patient.Phone = dto.Phone.Trim();
            patient.Email = dto.Email.Trim();
            patient.DateOfBirth = dto.DateOfBirth.Date;
            patient.Gender = dto.Gender;
            patient.Address = dto.Address.Trim();
            patient.BloodGroup = dto.BloodGroup.Trim();
            patient.EmergencyContact = dto.EmergencyContact.Trim();
            patient.MedicalHistorySummary = dto.MedicalHistorySummary.Trim();
            patient.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Patients.Update(patient);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully updated patient with ID: {PatientId}", id);
            return MapToDto(patient);
        }

        public async Task SoftDeletePatientAsync(int id, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Attempting to soft-delete patient with ID: {PatientId}", id);

            var patient = await _unitOfWork.Patients.GetByIdAsync(id, cancellationToken);
            if (patient == null)
            {
                _logger.LogWarning("Patient soft delete failed. Patient not found with ID: {PatientId}", id);
                throw new NotFoundException(nameof(Patient), id);
            }

            _unitOfWork.Patients.SoftDelete(patient);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Successfully soft-deleted patient with ID: {PatientId}", id);
        }

        private static PatientDto MapToDto(Patient patient)
        {
            return new PatientDto
            {
                Id = patient.Id,
                PatientCode = patient.PatientCode,
                FullName = patient.FullName,
                Phone = patient.Phone,
                Email = patient.Email,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                Address = patient.Address,
                BloodGroup = patient.BloodGroup,
                EmergencyContact = patient.EmergencyContact,
                MedicalHistorySummary = patient.MedicalHistorySummary,
                CreatedAt = patient.CreatedAt,
                UpdatedAt = patient.UpdatedAt
            };
        }
    }
}
