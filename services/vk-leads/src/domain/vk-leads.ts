import { vk_api_url_v1 } from '../entry-points/vk-api/vk-routes.js';
import { logger } from '../libraries/logger/index.js';
import { LeadForms, LeadsItem } from '../entry-points/vk-api/responses-type.js';
import { fetchData } from './fetch-data.js';
import csv from 'csvtojson';
import { crmRoute } from '../entry-points/vk-api/crm-routes.js';
import { NtlmClient, NtlmCredentials } from 'axios-ntlm';
import { client as clientRedis } from '../entry-points/server.js';

const getLeadForms = async () => {
  try {
    const data = await fetchData<LeadForms>(`${vk_api_url_v1}/lead_ads/lead_forms.json`, {});
    return data;
  } catch (error) {
    logger.error(`VK LEADS FETCH ERROR ${error}`);
  }
};

type LeadType = {
  [key: string]: string;
};

type SavedLead = {
  last_processed_at: string;
};

const getLeadsExportCSV = async (leadId: string) => {
  try {
    let lastProcessedTime;
    const leadExist = (await clientRedis.json.GET(leadId)) as unknown as SavedLead;
    if (leadExist) {
      const date = new Date(leadExist.last_processed_at);
      date.setMilliseconds(date.getMilliseconds() + 1);
      lastProcessedTime = date.toISOString().split('T').join(' ').split('.')[0];
    }

    const url = lastProcessedTime
      ? `${vk_api_url_v1}/lead_ads/lead_forms/${leadId}/leads.csv?_created_at__gte=${encodeURIComponent(
          lastProcessedTime,
        )}`
      : `${vk_api_url_v1}/lead_ads/lead_forms/${leadId}/leads.csv`;
    const data = await fetchData<string>(url, {});

    if (data) {
      const jsonData = (await csv().fromString(data)) as LeadType[];
      return jsonData;
    }
  } catch (error) {
    logger.error(`VK LEADS EXPORT FETCH ERROR ${error}`);
  }
};

const mapLeadToCRMFormat = (lead: LeadType, leadName: string) => {
  const keys = Object.keys(lead);
  const lastKey = keys[keys.length - 1];
  const lastValue = lead[lastKey];

  return {
    mobilephone: lead['Телефон'] ?? '',
    emailaddress1: '',
    subject: leadName,
    lastname: '',
    firstname: lead['Имя'] ?? '',
    description: `${lastKey}\n ${lastValue}`,
    companyname: 'fczenit',
    leadsourcecode: 1,
  };
};

const sendToCRM = async (answers: LeadType[], lead: LeadsItem) => {
  try {
    // Construct the batch request body
    let batchBody = '--batch_123456\r\n';
    batchBody += 'Content-Type: multipart/mixed; boundary=changeset_789012\r\n';

    for (const answer of answers) {
      const mappedLead = mapLeadToCRMFormat(answer, lead.name);
      batchBody += '\r\n--changeset_789012\r\n';
      batchBody += 'Content-Type: application/http\r\n';
      batchBody += 'Content-Transfer-Encoding: binary\r\n\r\n';
      batchBody += 'POST /fczenit/api/data/v9.1/leads HTTP/1.1\r\n';
      batchBody += 'Content-Type: application/json; charset=utf-8\r\n';
      batchBody += 'OData-Version: 4.0\r\n\r\n';
      batchBody += JSON.stringify(mappedLead);
      batchBody += '\r\n';
    }

    batchBody += '--changeset_789012--\r\n';
    batchBody += '--batch_123456--';

    const crmUrl = `${crmRoute}/$batch`; // Replace with your CRM endpoint

    // NTLM credentials
    const credentials: NtlmCredentials = {
      username: process.env.NTLM_USERNAME ?? '',
      password: process.env.NTLM_USERNAME_PASSWORD ?? '',
      domain: process.env.NTLM_DOMAIN ?? '',
    };

    const client = NtlmClient(credentials, {
      baseURL: crmUrl,
      headers: {
        'Content-Type': 'multipart/mixed; boundary=batch_123456',
      },
    });

    const response = await client.post('', batchBody);

    if (answers.length) {
      let lastLeadTime = answers[answers.length - 1]['Время лида'];
      lastLeadTime = lastLeadTime.replace(' +0300 MSK', '');
      const leadAlreadyExist = await clientRedis.json.GET(lead.id)
      if (leadAlreadyExist) {
        await clientRedis.json.SET(lead.id, '.last_processed_at', lastLeadTime);
      } else {
        await clientRedis.json.SET(lead.id, '.', {
          last_processed_at: lastLeadTime,
        });
      }
    }

    if (response.status !== 204) {
      throw new Error(`Failed to send data to CRM: ${response.statusText}`);
    }
  } catch (error) {
    logger.error(`SEND TO CRM ${JSON.stringify(answers)} FROM LEAD ${lead.id} ${lead.name} ERROR ${error}`);
  }
};

export const startFlow = async () => {
  const leadForms = await getLeadForms();
  if (leadForms) {
    for (const leadItem of leadForms.items) {
      const answers = await getLeadsExportCSV(leadItem.id);
      if (answers?.length) {
        sendToCRM(answers, leadItem);
      }
    }
  }
};
