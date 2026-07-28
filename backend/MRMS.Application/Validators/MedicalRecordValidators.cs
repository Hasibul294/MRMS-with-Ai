using FluentValidation;
using MRMS.Application.DTOs;

namespace MRMS.Application.Validators
{
    public class CreateMedicalRecordDtoValidator : AbstractValidator<CreateMedicalRecordDto>
    {
        public CreateMedicalRecordDtoValidator()
        {
            RuleFor(x => x.PatientId)
                .GreaterThan(0).WithMessage("Valid Patient must be selected.");

            RuleFor(x => x.DoctorId)
                .GreaterThan(0).WithMessage("Valid Doctor must be selected.");

            RuleFor(x => x.Diagnosis)
                .NotEmpty().WithMessage("Diagnosis is required.")
                .MaximumLength(500).WithMessage("Diagnosis description is too long.");

            RuleFor(x => x.ClinicalNotes)
                .NotEmpty().WithMessage("Clinical notes are required.");
        }
    }
}
