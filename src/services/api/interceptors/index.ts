import {AxiosInstance, AxiosError, AxiosResponse} from 'axios';
import useStore, {handleTokenExpiry} from '../../../state/store';
import {isValidStorageData} from '@services/validation/index.validator';
import {createNavigationContainerRef} from '@react-navigation/native';

// Create a navigation reference that can be used outside of components
export const navigationRef = createNavigationContainerRef();

// Helper function to navigate when not in a React component
export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  } else {
    // Save the navigation for when the ref is ready
    console.log('Navigation ref not ready yet, deferring navigation to', name);
  }
}

// Helper function to reset navigation stack
export function resetNavigation(routeName: string) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{name: routeName}],
    });
  }
}

export function setupAuthInterceptors(axiosInstance: AxiosInstance) {
  console.log('🔵 AUTH INTERCEPTORS: Setting up auth interceptors');

  // Response interceptor for handling expired tokens
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(
        '🔵 AUTH INTERCEPTORS: Success response from:',
        response.config.url,
      );
      return response;
    },
    async (error: AxiosError) => {
      console.log(
        '🔵 AUTH INTERCEPTORS: Error response intercepted:',
        error.message,
      );
      console.log(
        '🔵 AUTH INTERCEPTORS: Error status:',
        error.response?.status,
      );
      console.log('🔵 AUTH INTERCEPTORS: Error URL:', error.config?.url);

      const originalRequest = error.config;

      // Check if error is due to an expired token
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403) &&
        originalRequest
      ) {
        console.log('🔵 AUTH INTERCEPTORS: Detected 401/403 status code');

        // Get error message from response
        const errorData = error.response.data as any;
        const errorMsg = errorData?.message || errorData?.error || '';
        console.log(
          '🔵 AUTH INTERCEPTORS: Error message from server:',
          errorMsg,
        );

        // Check if token is expired based on error message
        const isTokenExpired =
          errorMsg.includes('expired') ||
          errorMsg.includes('invalid token') ||
          errorMsg.includes('jwt') ||
          error.response.status === 401;

        console.log('🔵 AUTH INTERCEPTORS: Is token expired?', isTokenExpired);

        if (isTokenExpired) {
          console.log(
            '🔵 AUTH INTERCEPTORS: Token expired, handling expiry...',
          );
          try {
            // Get the store's handleTokenExpiry function to try refreshing the token
            const userStore = useStore.getState();

            // Cast to any to add the _retry property
            const requestWithRetry = originalRequest as any;

            if (!requestWithRetry._retry && userStore.handleTokenExpiry) {
              console.log(
                '🔵 AUTH INTERCEPTORS: Attempting to refresh token and retry request',
              );

              // Mark that we're retrying this request
              requestWithRetry._retry = true;

              // Call the token expiry handler with the original request
              const updatedRequest = await userStore.handleTokenExpiry(
                requestWithRetry,
              );

              if (updatedRequest) {
                console.log(
                  '🔵 AUTH INTERCEPTORS: Token refreshed, retrying original request',
                );
                // Retry the original request with the new token
                return axiosInstance(updatedRequest);
              } else {
                console.log(
                  '🔵 AUTH INTERCEPTORS: Token refresh failed, resetting navigation',
                );
                // If token refresh failed, navigate to login
                resetNavigation('SignIn');
                console.log('🔵 AUTH INTERCEPTORS: Navigation reset completed');
              }
            } else {
              // Handle case where we can't retry or already retried
              console.log(
                '🔵 AUTH INTERCEPTORS: Unable to retry request, logging out',
              );
              await handleTokenExpiry();
              console.log(
                '🔵 AUTH INTERCEPTORS: Resetting navigation to SignIn',
              );
              resetNavigation('SignIn');
            }
          } catch (e) {
            console.error(
              '🔵 AUTH INTERCEPTORS: Error during token expiry handling:',
              e,
            );
            // In case of error, reset to login screen as fallback
            resetNavigation('SignIn');
          }
        }
      }

      return Promise.reject(error);
    },
  );

  // Request interceptor for adding auth token
  axiosInstance.interceptors.request.use(
    async config => {
      console.log('🔵 AUTH INTERCEPTORS: Request intercepted:', config.url);
      try {
        const state = useStore.getState();
        const {accessToken, expiredDate} = state;

        console.log(
          '🔵 AUTH INTERCEPTORS: Token status:',
          accessToken ? 'Token exists' : 'No token',
          expiredDate ? 'Expiry exists' : 'No expiry',
        );

        if (
          accessToken &&
          expiredDate &&
          isValidStorageData(accessToken, expiredDate)
        ) {
          console.log('🔵 AUTH INTERCEPTORS: Adding Authorization header');
          config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
          console.log(
            '🔵 AUTH INTERCEPTORS: No valid token found, not adding Authorization header',
          );
        }
      } catch (e) {
        console.log('🔵 AUTH INTERCEPTORS: Auth interceptor error:', e);
      }

      console.log('🔵 AUTH INTERCEPTORS: Proceeding with request');
      return config;
    },
    error => {
      console.log('🔵 AUTH INTERCEPTORS: Error in request interceptor:', error);
      return Promise.reject(error);
    },
  );

  return axiosInstance;
}
