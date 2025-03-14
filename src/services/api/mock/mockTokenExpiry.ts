import {userApiInstance} from '../axiosConfig';

/**
 * A mock function that simulates an API call with an expired token
 * This function will trigger the token expiry flow in the interceptors
 */
export const mockTokenExpiry = async () => {
  console.log('🔴 MOCK TOKEN EXPIRY: Function called');
  try {
    console.log('🔴 MOCK TOKEN EXPIRY: Making request to /mock-expired-token');
    // This is a fake endpoint that will trigger a 401 response
    await userApiInstance.get('/mock-expired-token');
    console.log(
      '🔴 MOCK TOKEN EXPIRY: Request completed (this should not happen)',
    );
  } catch (error) {
    // The error will be handled by the axios interceptor
    console.log(
      '🔴 MOCK TOKEN EXPIRY: Error caught in mockTokenExpiry:',
      error,
    );

    // Re-throw the error to ensure it propagates to the interceptors
    throw error;
  }
};

/**
 * Mock response interceptor to simulate token expiration
 * This function should be called during development to set up the mock
 */
export const setupMockTokenExpiryInterceptor = () => {
  console.log('🔴 MOCK INTERCEPTOR: Setting up mock token expiry interceptor');

  // Add a response interceptor specifically for the mock endpoint
  const interceptorId = userApiInstance.interceptors.request.use(
    async config => {
      console.log('🔴 MOCK INTERCEPTOR: Request intercepted:', config.url);

      // Check if this is our mock expired token endpoint
      if (config.url?.includes('/mock-expired-token')) {
        console.log(
          '🔴 MOCK INTERCEPTOR: Detected mock endpoint, simulating 401 error',
        );

        // Create an error that mimics an axios error with 401 response
        const error: any = new Error('Token has expired');
        error.response = {
          status: 401,
          data: {
            message: 'jwt expired',
            error: 'Unauthorized',
          },
        };

        // Log and reject
        console.log('🔴 MOCK INTERCEPTOR: Rejecting with error', error);
        return Promise.reject(error);
      }

      console.log(
        '🔴 MOCK INTERCEPTOR: Not a mock endpoint, continuing request',
      );
      return config;
    },
    error => {
      console.log('🔴 MOCK INTERCEPTOR: Error in request interceptor:', error);
      return Promise.reject(error);
    },
  );

  // Return a function to remove the interceptor if needed
  return () => {
    console.log('🔴 MOCK INTERCEPTOR: Cleaning up interceptor', interceptorId);
    userApiInstance.interceptors.request.eject(interceptorId);
  };
};
