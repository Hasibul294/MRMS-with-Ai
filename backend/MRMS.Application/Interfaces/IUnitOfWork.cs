using System.Threading;
using System.Threading.Tasks;

namespace MRMS.Application.Interfaces
{
    public interface IUnitOfWork
    {
        IPatientRepository Patients { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
