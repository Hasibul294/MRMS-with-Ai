using System;
using FluentValidation;
using MRMS.Application.DTOs;

namespace MRMS.Application.Validators
{
    public class CreateAppointmentDtoValidator : AbstractValidator<CreateAppointmentDto>
    {
        public CreateAppointmentDtoValidator()
        {
            RuleFor(x => x.PatientId)
                .GreaterThan(0).WithMessage("Valid Patient must be selected.");

            RuleFor(x => x.DoctorId)
                .GreaterThan(0).WithMessage("Valid Doctor must be selected.");

            RuleFor(x => x.AppointmentDateTime)
                .GreaterThan(DateTime.UtcNow.AddMinutes(-5))
                .WithMessage("Appointment date and time cannot be in the past.");

            RuleFor(x => x.ReasonForVisit)
                .NotEmpty().WithMessage("Reason for visit is required.")
                .MaximumLength(250).WithMessage("Reason for visit cannot exceed 250 characters.");
        }
    }

    public class RescheduleAppointmentDtoValidator : AbstractValidator<RescheduleAppointmentDto>
    {
        public RescheduleAppointmentDtoValidator()
        {
            RuleFor(x => x.NewAppointmentDateTime)
                .GreaterThan(DateTime.UtcNow.AddMinutes(-5))
                .WithMessage("New appointment date and time cannot be in the past.");
        }
    }
}
