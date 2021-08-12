const Worker = require('./worker');

const createWorker = async (config, logger) => {
  // const context = await factories.createContext();
  const worker = new Worker({}, logger);

  return worker;
};

module.exports = createWorker;
