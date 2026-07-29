using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MRMS.Domain.Entities;
using MRMS.Infrastructure.Data;

namespace MRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class DoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves the list of available doctors.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<Doctor>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDoctors(CancellationToken cancellationToken)
        {
            var doctors = await _context.Doctors
                .AsNoTracking()
                .Select(d => new
                {
                    d.Id,
                    d.FullName,
                    d.Specialization,
                    d.Phone,
                    d.Email,
                    d.LicenseNumber
                })
                .ToListAsync(cancellationToken);

            return Ok(doctors);
        }
    }
}
