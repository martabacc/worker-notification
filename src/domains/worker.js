const kafka = require('kafkajs');
const handler = require('../handlers/sendNotificationHandler');

class Worker {
  constructor(ctx) {
    this.config = ctx.config.kafka;
    this.ctx = ctx;

    this.consumer = this._createConsumer();

    this._handleMessage = this._handleMessage.bind(this);
  }

  _createConsumer() {
    const { brokerList, clientId, sasl, groupId } = this.config;

    const kafkaInstance = new kafka.Kafka({
      brokers: brokerList,
      clientId,
      ssl: { rejectUnauthorized: true },
      sasl
    });

    return kafkaInstance.consumer({ groupId });
  }

  async start() {
    const { notification: topic } = this.config.topics;

    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({ eachMessage: this._handleMessage(this.ctx) });
  }

  _handleMessage(context) {
    return async function ({ message }) {
      context.logger.info('Start handling message:', message.value);
      const parsedMessage = Worker._parseMessage({ message });

      await handler(context, parsedMessage);
    }
  }

  static _parseMessage({ message }) {
    try {
      return JSON.parse(message.value);
    } catch (e) {
      throw new Error(`[ERROR] Invalid JSON format: ${message.value}`);
    }
  }

  async stop() {
    await this.consumer.disconnect();
  }
}

module.exports = Worker;
