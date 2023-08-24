import axios from 'axios';
import { getVkLeadsAuth, updateAccessToken, updateRefreshToken } from '../data-access/vk-jwt.js';
import { vk_api_url_v2 } from '../entry-points/vk-api/vk-routes.js';

interface RefreshAccessTokenResponseData {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: string;
  refresh_token: string;
}

const refreshAccessToken = async () => {
  const { client_id, client_secret, refresh_token } = await getVkLeadsAuth();
  const bodyData = `grant_type=refresh_token&refresh_token=${encodeURIComponent(
    refresh_token,
  )}&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}`;

  try {
    const response = await axios.post<RefreshAccessTokenResponseData>(`${vk_api_url_v2}/oauth2/token.json`, bodyData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    await updateAccessToken(response.data.access_token);
    await updateRefreshToken(response.data.refresh_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

export default refreshAccessToken;
