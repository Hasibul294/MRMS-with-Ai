using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MRMS.Application.DTOs;
using MRMS.Domain.Entities;

namespace MRMS.Application.Interfaces
{
    public interface IAppointmentRepository
    {
        Task<Appointment?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<bool> ExistsByDoctorAndSlotAsync(int doctorId, DateTime dateTime, int? excludeId = null, CancellationToken cancellationToken = default);
        Task<List<Appointment>> GetFilteredAsync(AppointmentFilterDto filter, CancellationToken cancellationToken = default);
        Task AddAsync(Appointment appointment, CancellationToken cancellationToken = default);
        void Update(Appointment appointment);
    }
}
