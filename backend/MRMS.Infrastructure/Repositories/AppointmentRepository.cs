using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MRMS.Application.DTOs;
using MRMS.Application.Interfaces;
using MRMS.Domain.Entities;
using MRMS.Infrastructure.Data;

namespace MRMS.Infrastructure.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly ApplicationDbContext _context;

        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Appointment?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        }

        public async Task<bool> ExistsByDoctorAndSlotAsync(int doctorId, DateTime dateTime, int? excludeId = null, CancellationToken cancellationToken = default)
        {
            var query = _context.Appointments
                .Where(a => a.DoctorId == doctorId && a.AppointmentDateTime == dateTime);

            if (excludeId.HasValue)
            {
                query = query.Where(a => a.Id != excludeId.Value);
            }

            return await query.AnyAsync(cancellationToken);
        }

        public async Task<List<Appointment>> GetFilteredAsync(AppointmentFilterDto filter, CancellationToken cancellationToken = default)
        {
            var query = _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .AsNoTracking()
                .AsQueryable();

            if (filter.DoctorId.HasValue)
            {
                query = query.Where(a => a.DoctorId == filter.DoctorId.Value);
            }

            if (filter.PatientId.HasValue)
            {
                query = query.Where(a => a.PatientId == filter.PatientId.Value);
            }

            if (filter.Date.HasValue)
            {
                var date = filter.Date.Value.Date;
                query = query.Where(a => a.AppointmentDateTime.Date == date);
            }

            return await query.OrderBy(a => a.AppointmentDateTime).ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Appointment appointment, CancellationToken cancellationToken = default)
        {
            await _context.Appointments.AddAsync(appointment, cancellationToken);
        }

        public void Update(Appointment appointment)
        {
            _context.Appointments.Update(appointment);
        }
    }
}
