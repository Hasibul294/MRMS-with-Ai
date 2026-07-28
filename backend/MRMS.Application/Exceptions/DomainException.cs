using System;
using System.Collections.Generic;

namespace MRMS.Application.Exceptions
{
    public abstract class CustomException : Exception
    {
        public int StatusCode { get; }
        protected CustomException(string message, int statusCode) : base(message)
        {
            StatusCode = statusCode;
        }
    }

    public class NotFoundException : CustomException
    {
        public NotFoundException(string resourceName, object key)
            : base($"{resourceName} with key '{key}' was not found.", 404) { }
    }

    public class ConflictException : CustomException
    {
        public ConflictException(string message) : base(message, 409) { }
    }

    public class BadRequestException : CustomException
    {
        public BadRequestException(string message) : base(message, 400) { }
    }

    public class ValidationException : CustomException
    {
        public IDictionary<string, string[]> Errors { get; }

        public ValidationException(IDictionary<string, string[]> errors) 
            : base("One or more validation failures occurred.", 400)
        {
            Errors = errors;
        }
    }
}
