using System.Collections.Generic;
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
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IMedicalRecordService _recordService;

        public MedicalRecordsController(IMedicalRecordService recordService)
        {
            _recordService = recordService;
        }

        /// <summary>
        /// Retrieves clinical medical records.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<MedicalRecordDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMedicalRecords([FromQuery] int? patientId, CancellationToken cancellationToken)
        {
            var result = await _recordService.GetMedicalRecordsAsync(patientId, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves medical records for a specific patient.
        /// </summary>
        [HttpGet("patient/{patientId:int}")]
        [ProducesResponseType(typeof(List<MedicalRecordDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPatientRecords(int patientId, CancellationToken cancellationToken)
        {
            var result = await _recordService.GetMedicalRecordsAsync(patientId, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Creates a new clinical medical record.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(MedicalRecordDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateMedicalRecord([FromBody] CreateMedicalRecordDto dto, CancellationToken cancellationToken)
        {
            var result = await _recordService.CreateMedicalRecordAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetMedicalRecords), new { id = result.Id }, result);
        }

        /// <summary>
        /// Updates a medical record (Admin role check enforced).
        /// </summary>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(MedicalRecordDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateMedicalRecord(int id, [FromBody] UpdateMedicalRecordDto dto, CancellationToken cancellationToken)
        {
            var result = await _recordService.UpdateMedicalRecordAsync(id, dto, cancellationToken);
            return Ok(result);
        }
    }
}
