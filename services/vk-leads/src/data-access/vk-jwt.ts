import { client } from '../entry-points/server.js';

interface VkAuthInRedis {
  client_id: string;
  client_secret: string;
  access_token: string;
  refresh_token: string
} 
export const getVkLeadsAuth = async () => {
  const authCredentials = await client.json.GET('vk_auth_credentials') as unknown as VkAuthInRedis;
  return authCredentials;
};

export const updateAccessToken = async (value: string) => {
  await client.json.SET('vk_auth_credentials', 'access_token', value);
};

export const updateRefreshToken = async (value: string) => {
  await client.json.SET('vk_auth_credentials', 'refresh_token', value);
};

export const updateClientAuth = async (value: { clientId: string; clientSecret: string }) => {
  const { clientId: client_id, clientSecret: client_secret } = value;
  await client.json.SET('vk_auth_credentials', 'client_id', client_id);
  await client.json.SET('vk_auth_credentials', 'client_secret', client_secret);
};
