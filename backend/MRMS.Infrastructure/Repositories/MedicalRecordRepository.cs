using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MRMS.Application.Interfaces;
using MRMS.Domain.Entities;
using MRMS.Infrastructure.Data;

namespace MRMS.Infrastructure.Repositories
{
    public class MedicalRecordRepository : IMedicalRecordRepository
    {
        private readonly ApplicationDbContext _context;

        public MedicalRecordRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<MedicalRecord?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.MedicalRecords
                .Include(r => r.Patient)
                .Include(r => r.Doctor)
                .FirstOrDefaultAsync(r => r.Id == id, cancellationToken);
        }

        public async Task<List<MedicalRecord>> GetByPatientIdAsync(int patientId, CancellationToken cancellationToken = default)
        {
            var query = _context.MedicalRecords
                .Include(r => r.Patient)
                .Include(r => r.Doctor)
                .AsNoTracking()
                .AsQueryable();

            if (patientId > 0)
            {
                query = query.Where(r => r.PatientId == patientId);
            }

            return await query.OrderByDescending(r => r.CreatedAt).ToListAsync(cancellationToken);
        }

        public async Task AddAsync(MedicalRecord record, CancellationToken cancellationToken = default)
        {
            await _context.MedicalRecords.AddAsync(record, cancellationToken);
        }

        public void Update(MedicalRecord record)
        {
            _context.MedicalRecords.Update(record);
        }
    }
}
