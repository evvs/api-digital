import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getVkLeadsAuth } from '../data-access/vk-jwt.js';
import refreshAccessToken from './refresh-token.js';

type VKErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export const fetchData = async <T>(url: string, config: AxiosRequestConfig): Promise<T | undefined> => {
  const { access_token } = await getVkLeadsAuth();
  const authConfig = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${access_token}`,
    },
  };

  try {
    const response = await axios.get(url, authConfig);
    return response.data;
  } catch (error) {
    // Check if error is an instance of AxiosError
    if (error instanceof axios.AxiosError) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.status === 401) {
        const errorData = axiosError.response.data as VKErrorResponse;

        if (errorData.error.code === 'expired_token') {
          // Refresh the token and retry the request.
          const newAccessToken = await refreshAccessToken();

          const newAuthConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          };

          const retryResponse = await axios.get(url, newAuthConfig);
          return retryResponse.data;
        }
      }
    }
  }
};
