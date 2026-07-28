using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MRMS.Application.DTOs;
using MRMS.Application.Interfaces;

namespace MRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientsController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        /// <summary>
        /// Retrieves a paginated list of patients with optional filtering.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(PagedResultDto<PatientDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPatients([FromQuery] PatientFilterDto filter, CancellationToken cancellationToken)
        {
            var result = await _patientService.GetPatientsAsync(filter, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves a specific patient by ID.
        /// </summary>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(PatientDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPatientById(int id, CancellationToken cancellationToken)
        {
            var result = await _patientService.GetPatientByIdAsync(id, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Registers a new patient.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(PatientDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CreatePatient([FromBody] CreatePatientDto dto, CancellationToken cancellationToken)
        {
            var result = await _patientService.CreatePatientAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetPatientById), new { id = result.Id }, result);
        }

        /// <summary>
        /// Updates an existing patient profile.
        /// </summary>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(PatientDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] UpdatePatientDto dto, CancellationToken cancellationToken)
        {
            var result = await _patientService.UpdatePatientAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Soft-deletes a patient profile.
        /// </summary>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePatient(int id, CancellationToken cancellationToken)
        {
            await _patientService.SoftDeletePatientAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
