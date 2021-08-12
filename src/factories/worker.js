const { Kafka } = require('kafkajs');
const config = require('../config');
const handler = require('./handler');

class Worker {
  constructor(ctx, logger) {
    this.topic = config.kafka.topics.notification;
    this.groupId = config.kafka.groupId;
    this.logger = logger;
    this.ctx = ctx;

    this.consumer = this._createConsumer();
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
    await this.consumer.run({ eachMessage: this._handleMessage });
  }

  async _handleMessage({ message }) {
    try {
      const parsedMessage = JSON.parse(message.value);

      this.logger.info('Start handling message:', message);

      await handler(this.ctx, parsedMessage);
    } catch (e) {
      this.logger.error(`Parsing message error: Invalid message format: ${message}`);
    }
  }

  async stop() {
    await this.consumer.disconnect();
  }
}

module.exports = Worker;
