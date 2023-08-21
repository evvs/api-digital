import { logger } from 'logger';
import { startWebServer } from './entry-points/server.js';
const start = async () => {
  // 🦉 Array of entry point is being used to support more entry-points kinds like message queue, scheduled job,
  return Promise.all([startWebServer()]);
};
start()
  .then((startResponses) => {
    logger.info(`The vk leads has started successfully ${startResponses[0].address}${startResponses[0].port}`);
  })
  .catch((error) => {
    logger.error(error);
  });
