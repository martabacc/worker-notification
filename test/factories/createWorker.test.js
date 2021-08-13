const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const factories = require('../../src/factories');
const Worker = require('../../src/domains/worker');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('createWorker', () => {
  let config;
  let logger;

  beforeEach(() => {
    config = {
      name: 'abc',
      version: 'abc',
      http: { customer: 'abc', notification: 'dev' },
      kafka: {
        groupId: ['abc'],
        sasl: {},
        topics: {},
      },
    };
    logger = {
      debug: sinon.stub(),
      info: sinon.stub(),
      error: sinon.stub(),
    };
  });

  it('should return correct worker when called', () => {
    const worker = factories.createWorker(config, logger);

    expect(worker).to.be.instanceOf(Worker);
  });
});
