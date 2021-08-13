const request = require('request-promise-native');

const { NotificationConnector, CustomerConnector, CallbackConnector } = require('../connectors');

const DEFAULT_JSON_RESPONSE = true;

const getHttpRequest = (opts = {}) =>
  request.defaults({
    ...opts,
    time: true,
    resolveWithFullResponse: true,
  });

const createConnectors = (config, logger) => {
  const {
    name,
    version,
    http: { customer, notification },
  } = config;

  const headers = { 'User-Agent': `${name}-${version}` };

  const json = DEFAULT_JSON_RESPONSE;

  return {
    customerConnector: new CustomerConnector({
      logger,
      config,
      headers,
      httpRequest: getHttpRequest({
        json,
        ...customer,
      }),
    }),
    notificationConnector: new NotificationConnector({
      logger,
      config,
      headers,
      httpRequest: getHttpRequest({
        json,
        ...notification,
      }),
    }),
    callbackConnector: new CallbackConnector({
      logger,
      config,
      headers,
      httpRequest: getHttpRequest({
        json,
      }),
    }),
  };
};

module.exports = createConnectors;
