using System.Threading;
using System.Threading.Tasks;
using MRMS.Application.DTOs;

namespace MRMS.Application.Interfaces
{
    public interface IPatientService
    {
        Task<PagedResultDto<PatientDto>> GetPatientsAsync(PatientFilterDto filter, CancellationToken cancellationToken = default);
        Task<PatientDto> GetPatientByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<PatientDto> CreatePatientAsync(CreatePatientDto dto, CancellationToken cancellationToken = default);
        Task<PatientDto> UpdatePatientAsync(int id, UpdatePatientDto dto, CancellationToken cancellationToken = default);
        Task SoftDeletePatientAsync(int id, CancellationToken cancellationToken = default);
    }
}
