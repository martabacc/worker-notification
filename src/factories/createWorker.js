const Worker = require('../domains/worker');
const createContext = require('./createContext');

const createWorker = async (config, logger) => {
  const context = createContext(config, logger);

  return new Worker(context, logger);
};

module.exports = createWorker;
