using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Moq;
using MRMS.Application.DTOs;
using MRMS.Application.Exceptions;
using MRMS.Application.Interfaces;
using MRMS.Application.Services;
using MRMS.Domain.Entities;
using Xunit;

namespace MRMS.Tests
{
    public class AppointmentServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IAppointmentRepository> _appointmentRepoMock;
        private readonly Mock<ILogger<AppointmentService>> _loggerMock;
        private readonly AppointmentService _service;

        public AppointmentServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _appointmentRepoMock = new Mock<IAppointmentRepository>();
            _loggerMock = new Mock<ILogger<AppointmentService>>();

            _service = new AppointmentService(_unitOfWorkMock.Object, _appointmentRepoMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task BookAppointmentAsync_ShouldBook_WhenSlotIsAvailable()
        {
            // Arrange
            var futureDate = DateTime.UtcNow.AddDays(2);
            var dto = new CreateAppointmentDto
            {
                PatientId = 1,
                DoctorId = 2,
                AppointmentDateTime = futureDate,
                ReasonForVisit = "Cardiology consultation"
            };

            _appointmentRepoMock.Setup(r => r.ExistsByDoctorAndSlotAsync(dto.DoctorId, dto.AppointmentDateTime, null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

            // Act
            var result = await _service.BookAppointmentAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.PatientId, result.PatientId);
            Assert.Equal(dto.DoctorId, result.DoctorId);
            _appointmentRepoMock.Verify(r => r.AddAsync(It.IsAny<Appointment>(), It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task BookAppointmentAsync_ShouldThrowConflictException_WhenDoctorSlotIsTaken()
        {
            // Arrange
            var futureDate = DateTime.UtcNow.AddDays(1);
            var dto = new CreateAppointmentDto
            {
                PatientId = 1,
                DoctorId = 2,
                AppointmentDateTime = futureDate,
                ReasonForVisit = "Follow-up"
            };

            _appointmentRepoMock.Setup(r => r.ExistsByDoctorAndSlotAsync(dto.DoctorId, dto.AppointmentDateTime, null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            // Act & Assert
            await Assert.ThrowsAsync<ConflictException>(() => _service.BookAppointmentAsync(dto));
        }

        [Fact]
        public async Task BookAppointmentAsync_ShouldThrowBadRequestException_WhenDateIsInPast()
        {
            // Arrange
            var pastDate = DateTime.UtcNow.AddDays(-2);
            var dto = new CreateAppointmentDto
            {
                PatientId = 1,
                DoctorId = 2,
                AppointmentDateTime = pastDate,
                ReasonForVisit = "Routine"
            };

            // Act & Assert
            await Assert.ThrowsAsync<BadRequestException>(() => _service.BookAppointmentAsync(dto));
        }
    }
}
