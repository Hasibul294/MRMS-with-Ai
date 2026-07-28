using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Moq;
using MRMS.Application.DTOs;
using MRMS.Application.Interfaces;
using MRMS.Application.Services;
using MRMS.Domain.Entities;
using Xunit;

namespace MRMS.Tests
{
    public class MedicalRecordServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IMedicalRecordRepository> _recordRepoMock;
        private readonly Mock<ILogger<MedicalRecordService>> _loggerMock;
        private readonly MedicalRecordService _service;

        public MedicalRecordServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _recordRepoMock = new Mock<IMedicalRecordRepository>();
            _loggerMock = new Mock<ILogger<MedicalRecordService>>();

            _service = new MedicalRecordService(_unitOfWorkMock.Object, _recordRepoMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task CreateMedicalRecordAsync_ShouldCreateRecord_WhenValid()
        {
            // Arrange
            var dto = new CreateMedicalRecordDto
            {
                PatientId = 1,
                DoctorId = 2,
                Diagnosis = "Hypertension Grade 1",
                ClinicalNotes = "Patient presented with elevated BP. Advised salt restriction.",
                PrescriptionMedicines = "Tab. Amlodipine 5mg once daily",
                VitalSigns = "BP: 142/90 mmHg"
            };

            // Act
            var result = await _service.CreateMedicalRecordAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Diagnosis, result.Diagnosis);
            Assert.True(result.IsLocked);
            _recordRepoMock.Verify(r => r.AddAsync(It.IsAny<MedicalRecord>(), It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task UpdateMedicalRecordAsync_ShouldThrowForbiddenException_WhenUserIsNotAdmin()
        {
            // Arrange
            int recordId = 501;
            var record = new MedicalRecord { Id = recordId, Diagnosis = "Old Diagnosis", ClinicalNotes = "Old notes", IsLocked = true };
            _recordRepoMock.Setup(r => r.GetByIdAsync(recordId, It.IsAny<CancellationToken>())).ReturnsAsync(record);

            var updateDto = new UpdateMedicalRecordDto
            {
                Diagnosis = "Attempted Change",
                ClinicalNotes = "Attempted notes",
                UserRole = "Doctor" // Non-admin role
            };

            // Act & Assert
            await Assert.ThrowsAsync<CustomForbiddenException>(() => _service.UpdateMedicalRecordAsync(recordId, updateDto));
        }

        [Fact]
        public async Task UpdateMedicalRecordAsync_ShouldUpdate_WhenUserIsAdmin()
        {
            // Arrange
            int recordId = 501;
            var record = new MedicalRecord { Id = recordId, Diagnosis = "Old Diagnosis", ClinicalNotes = "Old notes" };
            _recordRepoMock.Setup(r => r.GetByIdAsync(recordId, It.IsAny<CancellationToken>())).ReturnsAsync(record);

            var updateDto = new UpdateMedicalRecordDto
            {
                Diagnosis = "Updated Diagnosis",
                ClinicalNotes = "Updated notes",
                UserRole = "Admin" // Admin role
            };

            // Act
            var result = await _service.UpdateMedicalRecordAsync(recordId, updateDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Diagnosis", result.Diagnosis);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
