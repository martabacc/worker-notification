const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    HOST: Joi.string().required(),
    PORT: Joi.number().default(3000),
    KAFKA_BROKER_LIST: Joi.string().required(),
    KAFKA_PROTOCOL_MECHANISM: Joi.string().required(),
    KAFKA_PROTOCOL: Joi.string().required(),
    KAFKA_CLIENT_ID: Joi.string().required(),
    KAFKA_GROUP_ID: Joi.string().required(),
    KAFKA_PRODUCER_USERNAME: Joi.string().required(),
    KAFKA_PRODUCER_PASSWORD: Joi.string().required(),
    KAFKA_NOTIFICATION_TOPIC_NAME: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.HOST,
  kafka: {
    brokerList: envVars.KAFKA_BROKER_LIST.split(','),
    protocol: envVars.KAFKA_PROTOCOL,
    clientId: envVars.KAFKA_CLIENT_ID,
    groupId: envVars.KAFKA_GROUP_ID,
    sasl: {
      mechanism: envVars.KAFKA_PROTOCOL_MECHANISM,
      username: envVars.KAFKA_PRODUCER_USERNAME,
      password: envVars.KAFKA_PRODUCER_PASSWORD,
    },
    topics: {
      notification: envVars.KAFKA_NOTIFICATION_TOPIC_NAME,
    },
  },
};
