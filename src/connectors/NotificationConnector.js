const { StatusCodes } = require('http-status-codes');

class NotificationConnector {
  constructor(opts) {
    Object.assign(this, opts);
  }

  async markAsComplete(notificationId) {
    this.logger.debug(`Notifying success for id: ${notificationId}`);

    const response = await this.httpRequest({
      method: 'PATCH',
      url: `/notification/${notificationId}`,
      headers: {
        ...this.headers
      },
      body: { is_delivered: true }
    });

    if (response.statusCode !== StatusCodes.OK) {
      throw new Error(`Error notifying success for id: ${notificationId}`);
    }

    return response.body;
  }
}

module.exports = NotificationConnector;
