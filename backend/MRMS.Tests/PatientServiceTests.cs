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
using MRMS.Domain.Enums;
using Xunit;

namespace MRMS.Tests
{
    public class PatientServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IPatientRepository> _patientRepoMock;
        private readonly Mock<ILogger<PatientService>> _loggerMock;
        private readonly PatientService _service;

        public PatientServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _patientRepoMock = new Mock<IPatientRepository>();
            _loggerMock = new Mock<ILogger<PatientService>>();

            _unitOfWorkMock.Setup(u => u.Patients).Returns(_patientRepoMock.Object);
            _service = new PatientService(_unitOfWorkMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task CreatePatientAsync_ShouldCreatePatient_WhenPhoneIsUnique()
        {
            // Arrange
            var dto = new CreatePatientDto
            {
                FullName = "John Doe",
                Phone = "+1234567890",
                Email = "john@example.com",
                DateOfBirth = new DateTime(1990, 5, 15),
                Gender = Gender.Male,
                Address = "123 Main St",
                BloodGroup = "O+"
            };

            _patientRepoMock.Setup(r => r.ExistsByPhoneAsync(dto.Phone, null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

            // Act
            var result = await _service.CreatePatientAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.FullName, result.FullName);
            Assert.Equal(dto.Phone, result.Phone);
            Assert.StartsWith("PAT-", result.PatientCode);

            _patientRepoMock.Verify(r => r.AddAsync(It.IsAny<Patient>(), It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task CreatePatientAsync_ShouldThrowConflictException_WhenPhoneExists()
        {
            // Arrange
            var dto = new CreatePatientDto
            {
                FullName = "Jane Doe",
                Phone = "+1234567890",
                DateOfBirth = new DateTime(1992, 8, 20),
                Gender = Gender.Female
            };

            _patientRepoMock.Setup(r => r.ExistsByPhoneAsync(dto.Phone, null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            // Act & Assert
            await Assert.ThrowsAsync<ConflictException>(() => _service.CreatePatientAsync(dto));
            _patientRepoMock.Verify(r => r.AddAsync(It.IsAny<Patient>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task GetPatientByIdAsync_ShouldThrowNotFoundException_WhenPatientDoesNotExist()
        {
            // Arrange
            int nonExistentId = 999;
            _patientRepoMock.Setup(r => r.GetByIdAsync(nonExistentId, It.IsAny<CancellationToken>()))
                .ReturnsAsync((Patient?)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => _service.GetPatientByIdAsync(nonExistentId));
        }
    }
}
