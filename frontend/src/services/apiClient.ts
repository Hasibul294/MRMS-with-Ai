import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor for handling standardized backend errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const data = error.response.data;
      const status = error.response.status;

      let customErrorMessage = data?.message || data?.title || 'An unexpected server error occurred.';
      
      if (data?.errors) {
        const errorList = Object.entries(data.errors)
          .map(([key, msgs]) => `${key}: ${msgs.join(', ')}`)
          .join(' | ');
        if (errorList) customErrorMessage += ` (${errorList})`;
      }

      return Promise.reject({
        status,
        message: customErrorMessage,
        data,
      });
    }

    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Unable to connect to backend server. Operating in offline/mock mode.',
      });
    }

    return Promise.reject({
      status: 500,
      message: error.message,
    });
  }
);
