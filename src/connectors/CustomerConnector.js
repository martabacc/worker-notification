const { StatusCodes } = require('http-status-codes');

class CustomerConnector {
  constructor(opts) {
    Object.assign(this, opts);
  }

  async getCustomer(customerId) {
    this.logger.info(`Getting customerId: ${customerId}`);

    const response = await this.httpRequest({
      method: 'GET',
      url: `/customer/${customerId}`,
      headers: {
        ...this.headers
      }
    });

    if (response.statusCode !== StatusCodes.OK) {
      throw new Error(`Error retrieving customer detail: ${customerId}`);
    }

    return response.body;
  }
}

module.exports = CustomerConnector;
