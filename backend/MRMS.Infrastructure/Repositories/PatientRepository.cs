using System;
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
    public class PatientRepository : IPatientRepository
    {
        private readonly ApplicationDbContext _context;

        public PatientRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Patient?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Patients
                .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        }

        public async Task<Patient?> GetByPhoneAsync(string phone, CancellationToken cancellationToken = default)
        {
            return await _context.Patients
                .FirstOrDefaultAsync(p => p.Phone == phone, cancellationToken);
        }

        public async Task<bool> ExistsByPhoneAsync(string phone, int? excludeId = null, CancellationToken cancellationToken = default)
        {
            var query = _context.Patients.AsQueryable();

            if (excludeId.HasValue)
            {
                query = query.Where(p => p.Id != excludeId.Value);
            }

            return await query.AnyAsync(p => p.Phone == phone, cancellationToken);
        }

        public async Task<PagedResultDto<Patient>> GetPagedAsync(PatientFilterDto filter, CancellationToken cancellationToken = default)
        {
            var query = _context.Patients.AsNoTracking();

            // Search filter by Name, Phone, Email, or PatientCode
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                var term = filter.SearchTerm.Trim().ToLower();
                query = query.Where(p => 
                    p.FullName.ToLower().Contains(term) ||
                    p.Phone.Contains(term) ||
                    p.Email.ToLower().Contains(term) ||
                    p.PatientCode.ToLower().Contains(term));
            }

            if (filter.Gender.HasValue)
            {
                query = query.Where(p => p.Gender == filter.Gender.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.BloodGroup))
            {
                query = query.Where(p => p.BloodGroup == filter.BloodGroup.Trim());
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResultDto<Patient>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task AddAsync(Patient patient, CancellationToken cancellationToken = default)
        {
            await _context.Patients.AddAsync(patient, cancellationToken);
        }

        public void Update(Patient patient)
        {
            _context.Patients.Update(patient);
        }

        public void SoftDelete(Patient patient)
        {
            patient.IsDeleted = true;
            patient.DeletedAt = DateTime.UtcNow;
            _context.Patients.Update(patient);
        }
    }
}
