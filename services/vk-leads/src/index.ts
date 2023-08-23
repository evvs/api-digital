import { logger } from './libraries/logger/index.js';
import { connectRedis, startWebServer } from './entry-points/server.js';
import { AddressInfo } from 'net';
import { getLeadForms } from './domain/vk-leads.js';
const start = async () => {
  await connectRedis();
  return await startWebServer();
};
start()
  .then((startResponses: AddressInfo) => {
    logger.info(`The vk leads has started successfully ${startResponses.address}${startResponses.port}`);
    getLeadForms();
  })
  .catch((error) => {
    logger.error(error);
  });
