const { StatusCodes } = require('http-status-codes');

class CallbackConnector {
  constructor(opts) {
    Object.assign(this, opts);
  }

  async request(opts) {
    const { customer_id, authentication_key, callback_url, notification_id, ...payload } = opts;
    this.logger.debug(`Calling callbackURL for customerId: ${customer_id}`);

    const response = await this.httpRequest({
      method: 'POST',
      url: callback_url,
      headers: {
        ...this.headers,
        'x-idempotency-key': notification_id
      },
      body: {
        ...payload,
        customer_id,
        authentication_key
      }
    });

    if (response.statusCode !== StatusCodes.OK) {
      throw new Error(`Error triggering callback for: ${notification_id}`);
    }

    return response.body;
  }
}

module.exports = CallbackConnector;
