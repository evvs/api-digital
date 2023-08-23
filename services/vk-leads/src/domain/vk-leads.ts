import axios from 'axios';
import { vk_api_url } from '../entry-points/vk-api/vk-routes.js';
import { logger } from '../libraries/logger/index.js';
import { LeadForms } from '../entry-points/vk-api/responses-type.js';
import { getVkLeadsAuth } from '../data-access/vk-jwt.js';

export const getLeadForms = async () => {
  try {
    const { access_token } = await getVkLeadsAuth();
    const response = await axios.get<LeadForms>(`${vk_api_url}/lead_ads/lead_forms.json`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    logger.error(`VK LEADS ERROR ${error}`);
  }
};
