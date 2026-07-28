using System;
using System.Threading;
using System.Threading.Tasks;
using MRMS.Application.Interfaces;
using MRMS.Infrastructure.Data;

namespace MRMS.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IPatientRepository? _patients;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public IPatientRepository Patients => _patients ??= new PatientRepository(_context);

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
