import { vk_api_url_v1 } from '../entry-points/vk-api/vk-routes.js';
import { logger } from '../libraries/logger/index.js';
import { LeadForms } from '../entry-points/vk-api/responses-type.js';
import { fetchData } from './fetch-data.js';

export const getLeadForms = async () => {
  try {
    const data = await fetchData<LeadForms>(`${vk_api_url_v1}/lead_ads/lead_forms.json`, {});
    return data
  } catch (error) {
    logger.error(`VK LEADS FETCH ERROR ${error}`);
  }
};
