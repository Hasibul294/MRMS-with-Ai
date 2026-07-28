using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MRMS.Application.DTOs;

namespace MRMS.Application.Interfaces
{
    public interface IAppointmentService
    {
        Task<List<AppointmentDto>> GetAppointmentsAsync(AppointmentFilterDto filter, CancellationToken cancellationToken = default);
        Task<AppointmentDto> GetAppointmentByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<AppointmentDto> BookAppointmentAsync(CreateAppointmentDto dto, CancellationToken cancellationToken = default);
        Task<AppointmentDto> RescheduleAppointmentAsync(int id, RescheduleAppointmentDto dto, CancellationToken cancellationToken = default);
        Task<AppointmentDto> CancelAppointmentAsync(int id, CancellationToken cancellationToken = default);
    }
}
