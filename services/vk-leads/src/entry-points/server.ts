import express from 'express';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { Server } from 'http';
import { AddressInfo } from 'net';
import helmet from 'helmet';

dotenv.config();

let connection: Server;

const openConnection = async (expressApp: express.Application): Promise<AddressInfo> => {
  return new Promise((resolve) => {
    // ️️️✅ Best Practice: Allow a dynamic port (port 0 = ephemeral) so multiple webservers can be used in multi-process testing
    const portToListenTo = process.env.PORT;
    const webServerPort = portToListenTo || 0;
    //   logger.info(`Server is about to listen to port ${webServerPort}`);
    connection = expressApp.listen(webServerPort, () => {
      // errorHandler.listenToErrorEvents(connection);
      resolve(connection.address() as AddressInfo);
    });
  });
};

// ️️️✅ Best Practice: API exposes a start/stop function to allow testing control WHEN this should happen
export const startWebServer = async (): Promise<AddressInfo> => {
  // ️️️✅ Best Practice: Declare a strict configuration schema and fail fast if the configuration is invalid
  // configurationProvider.initializeAndValidate(configurationSchema);
  // logger.configureLogger(
  //   {
  //     prettyPrint: Boolean(
  //       configurationProvider.getValue('logger.prettyPrint')
  //     ),
  //   },
  //   true
  // );
  const expressApp = express();
  // expressApp.use(addRequestIdExpressMiddleware);
  expressApp.use(helmet());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
  // expressApp.use(
  //   jwtVerifierMiddleware({
  //     secret: configurationProvider.getValue('jwtTokenSecret'),
  //   })
  // );
  // defineRoutes(expressApp);
  // defineErrorHandlingMiddleware(expressApp);
  const APIAddress = await openConnection(expressApp);
  return APIAddress;
};

export const client = createClient();


export const connectRedis = async () => {
  try {

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    // await client.auth({
    //   password: process.env.REDIS_PASSWORD ?? '',
    // });
  } catch (error) {
    throw new Error('REDIS CONNECTION ERROR!');
  }
};
