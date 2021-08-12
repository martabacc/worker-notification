const createConnectors = require('./createConnectors');

const createContext = (config, logger) => {
  const connectors = createConnectors(config, logger);

  return {
    connectors,
    config,
    logger
  }
};

module.exports = createContext;
