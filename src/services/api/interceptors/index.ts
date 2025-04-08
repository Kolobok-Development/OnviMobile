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
      // Cast to any to add/check the _retry property
      const requestWithRetry = originalRequest as any;

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
          error.response.status === 401 ||
          error.response.status === 403;

        console.log('🔵 AUTH INTERCEPTORS: Is token expired?', isTokenExpired);

        // Get the store's handleTokenExpiry function to try refreshing the token
        const userStore = useStore.getState();

        // Check if this is a refresh token request that failed
        const isRefreshTokenRequest =
          originalRequest.url?.includes('/refresh-token') ||
          originalRequest.url?.includes('/refresh') ||
          requestWithRetry._isRefreshRequest;

        if (isRefreshTokenRequest) {
          console.log(
            '🔵 AUTH INTERCEPTORS: Refresh token request failed, signing out',
          );
          await userStore.signOut();
          return Promise.reject(error);
        }

        if (
          isTokenExpired &&
          !requestWithRetry._retry &&
          userStore.handleTokenExpiry
        ) {
          console.log(
            '🔵 AUTH INTERCEPTORS: Attempting to refresh token and retry request',
          );

          // Mark that we're retrying this request
          requestWithRetry._retry = true;

          try {
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
          } catch (refreshError) {
            console.error(
              '🔵 AUTH INTERCEPTORS: Error during token refresh:',
              refreshError,
            );
            await userStore.signOut();
            resetNavigation('SignIn');
            return Promise.reject(error);
          }
        } else if (requestWithRetry._retry || !userStore.handleTokenExpiry) {
          // This is either a retry or we don't have a token refresh handler
          console.log(
            '🔵 AUTH INTERCEPTORS: Already retried or no refresh handler, logging out',
          );
          await userStore.signOut();
          resetNavigation('SignIn');
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

        // Mark refresh token requests to identify them in the response interceptor
        if (
          config.url?.includes('/refresh-token') ||
          config.url?.includes('/refresh')
        ) {
          (config as any)._isRefreshRequest = true;
        }

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
