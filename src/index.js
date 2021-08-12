/* eslint-disable */
const bunyan = require('bunyan');
const config = require('./config');
const createWorker = require('./factories/createWorker');

const logger = bunyan.createLogger({ name: "notification-worker" });

const stop = ({ worker }) => async (signal) => {
  await worker.stop(signal);

  logger.debug('Worker stopped');
  process.exit(0);
};

(async () => {
  logger.info('Configuring workers');
  const worker = await createWorker(config, logger);

  await worker.start();
  logger.info('Worker started!');

  process.on('SIGINT', stop({ worker }));
  process.on('SIGTERM', stop({ worker }));
})();
