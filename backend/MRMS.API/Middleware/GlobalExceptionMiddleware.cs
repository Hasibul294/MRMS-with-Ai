using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MRMS.Application.Exceptions;

namespace MRMS.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception captured in middleware: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            int statusCode = (int)HttpStatusCode.InternalServerError;
            string title = "Internal Server Error";
            object? errors = null;

            switch (exception)
            {
                case CustomException customEx:
                    statusCode = customEx.StatusCode;
                    title = customEx.Message;
                    if (customEx is ValidationException valEx)
                    {
                        errors = valEx.Errors;
                    }
                    break;

                case FluentValidation.ValidationException fvEx:
                    statusCode = (int)HttpStatusCode.BadRequest;
                    title = "Validation failed.";
                    var errorDict = new System.Collections.Generic.Dictionary<string, string[]>();
                    foreach (var err in fvEx.Errors)
                    {
                        errorDict[err.PropertyName] = new[] { err.ErrorMessage };
                    }
                    errors = errorDict;
                    break;
            }

            context.Response.StatusCode = statusCode;

            var response = new
            {
                StatusCode = statusCode,
                Title = title,
                Message = exception.Message,
                Errors = errors,
                Timestamp = DateTime.UtcNow
            };

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            return context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }
    }
}
