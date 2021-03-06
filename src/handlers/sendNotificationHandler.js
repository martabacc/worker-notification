const sendNotificationHandler = async (ctx, parsedMessage) => {
  const { customer_id, is_testing, ...payload } = parsedMessage;
  const { notification_id } = parsedMessage;

  const {
    logger,
    connectors: { customerConnector, notificationConnector, callbackConnector },
  } = ctx;

  try {
    if (!is_testing) {
      const customer = await customerConnector.getCustomer(customer_id);
      Object.assign(payload, {
        callback_url: customer.callback_url,
        authentication_key: customer.authentication_key,
      });
    }

    logger.info(`Calling callback of details: ${notification_id}`);
    await callbackConnector.request({
      ...payload,
      customer_id,
    });

    logger.info(`Success trigger, marking notification as complete: ${notification_id}`);
    await notificationConnector.markAsComplete(notification_id);
  } catch (e) {
    logger.error(`Error occured while processing ${JSON.stringify(parsedMessage)}, skipping..`);
  }
};

module.exports = sendNotificationHandler;
