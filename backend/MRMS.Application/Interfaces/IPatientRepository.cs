using System.Threading;
using System.Threading.Tasks;
using MRMS.Application.DTOs;
using MRMS.Domain.Entities;

namespace MRMS.Application.Interfaces
{
    public interface IPatientRepository
    {
        Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<Patient?> GetByPhoneAsync(string phone, CancellationToken cancellationToken = default);
        Task<bool> ExistsByPhoneAsync(string phone, int? excludeId = null, CancellationToken cancellationToken = default);
        Task<PagedResultDto<Patient>> GetPagedAsync(PatientFilterDto filter, CancellationToken cancellationToken = default);
        Task AddAsync(Patient patient, CancellationToken cancellationToken = default);
        void Update(Patient patient);
        void SoftDelete(Patient patient);
    }
}
