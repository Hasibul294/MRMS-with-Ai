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
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        /// <summary>
        /// Retrieves filtered appointment listings.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<AppointmentDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAppointments([FromQuery] AppointmentFilterDto filter, CancellationToken cancellationToken)
        {
            var result = await _appointmentService.GetAppointmentsAsync(filter, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves a specific appointment by ID.
        /// </summary>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAppointmentById(int id, CancellationToken cancellationToken)
        {
            var result = await _appointmentService.GetAppointmentByIdAsync(id, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Schedules a new patient appointment.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> BookAppointment([FromBody] CreateAppointmentDto dto, CancellationToken cancellationToken)
        {
            var result = await _appointmentService.BookAppointmentAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetAppointmentById), new { id = result.Id }, result);
        }

        /// <summary>
        /// Reschedules an existing appointment slot.
        /// </summary>
        [HttpPut("{id:int}/reschedule")]
        [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> RescheduleAppointment(int id, [FromBody] RescheduleAppointmentDto dto, CancellationToken cancellationToken)
        {
            var result = await _appointmentService.RescheduleAppointmentAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Cancels an appointment.
        /// </summary>
        [HttpPut("{id:int}/cancel")]
        [ProducesResponseType(typeof(AppointmentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CancelAppointment(int id, CancellationToken cancellationToken)
        {
            var result = await _appointmentService.CancelAppointmentAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}
