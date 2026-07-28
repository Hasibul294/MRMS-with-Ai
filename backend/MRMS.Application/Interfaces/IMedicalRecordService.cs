using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MRMS.Application.DTOs;
using MRMS.Domain.Entities;

namespace MRMS.Application.Interfaces
{
    public interface IMedicalRecordRepository
    {
        Task<MedicalRecord?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<List<MedicalRecord>> GetByPatientIdAsync(int patientId, CancellationToken cancellationToken = default);
        Task AddAsync(MedicalRecord record, CancellationToken cancellationToken = default);
        void Update(MedicalRecord record);
    }

    public interface IMedicalRecordService
    {
        Task<List<MedicalRecordDto>> GetMedicalRecordsAsync(int? patientId = null, CancellationToken cancellationToken = default);
        Task<MedicalRecordDto> GetMedicalRecordByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<MedicalRecordDto> CreateMedicalRecordAsync(CreateMedicalRecordDto dto, CancellationToken cancellationToken = default);
        Task<MedicalRecordDto> UpdateMedicalRecordAsync(int id, UpdateMedicalRecordDto dto, CancellationToken cancellationToken = default);
    }
}
