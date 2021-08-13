# Worker Notification

[![Build Status](https://api.travis-ci.com/martabacc/worker-notification.svg?branch=master&status=passed)](https://travis-ci.org/martabacc/worker-notification)
[![Coverage Status](https://coveralls.io/repos/github/martabacc/worker-notification/badge.svg?branch=master)](https://coveralls.io/github/martabacc/worker-notification?branch=master)

Server dedicated for technical assesment

## Quick Start

```bash
git clone git@github.com:martabacc/worker-notification.git

cd worker-notification

npm run install
```

## Table of Contents

- [Features](#features)

## Features

- **Queue **: [Kafka](https://www.kafka.com) to handle request queue from producer
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using bunyan
- **Testing**: unit and integration tests using sinon
- **Dependency management**: with npm
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)

## Commands

Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm run start
```

Testing:

```bash
# run all tests
npm run test

# run all tests in watch mode
npm run test:watch

# run test coverage
npm run coverage
```

Docker:

```bash

# run all tests in a docker container
npm run docker:test
```

Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
NODE_ENV=development

# KAFKA DETAILS
KAFKA_BROKER_LIST=abc:9093,abc:9094,abc:9095
KAFKA_CONSUMER_USERNAME=username
KAFKA_CONSUMER_PASSWORD=password
KAFKA_NOTIFICATION_TOPIC_NAME=notification
KAFKA_CLIENT_ID=ms-customer-notification-test
KAFKA_GROUP_ID=ms-customer-notification-test
KAFKA_PROTOCOL=SASL_SSL
KAFKA_PROTOCOL_MECHANISM=SCRAM-SHA-256


#HTTP CONNECTORS
MS_CUSTOMER_BASE_URL=http://localhost:3000
MS_NOTIFICATION_BASE_URL=http://localhost:3000

```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--connectors\    # Route controllers (controller layer)
 |--domains\       # Main Logics of several attributes the code (Class declaration, etc)
 |--handlers\       # Defined handlers to handle  message
 |--index.js        # App entry point
```

## Sample Payload

Make sure that payload is a valid stringified JSON, worker won't process if it's not a valid JSON.
```
{
    "payment_id":"123123123",
    "payment_code":"XYZ123",
    "amount":"50000",
    "paid_at":"2020-10-17 07:41:33.866Z",
    "external_id":"order-123",
    "customer_id":"MAJU_CORP_PASAR_MINGGU",
    "is_delivered":false,
    "notification_id":"6115ead1ea94e02e63eec553",
    "id":"6115ead1ea94e02e63eec553"
}
```

## License

[MIT](LICENSE)
