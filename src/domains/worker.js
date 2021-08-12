const { Kafka } = require('kafkajs');
const config = require('../config');
const handler = require('../factories/handler');

class Worker {
  constructor(ctx) {
    this.topic = config.kafka.topics.notification;
    this.groupId = config.kafka.groupId;
    this.ctx = ctx;

    this.consumer = this._createConsumer();

    this._handleMessage = this._handleMessage.bind(this);
  }

  _createConsumer() {
    const kafka = new Kafka({
      brokers: config.kafka.brokerList,
      clientId: config.kafka.clientId,
      ssl: { rejectUnauthorized: true },
      sasl: config.kafka.sasl,
    });

    return kafka.consumer({ groupId: this.groupId });
  }

  async start() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
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
