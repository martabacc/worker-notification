const kafka  = require('kafkajs');
const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const Worker = require('../../src/domains/worker');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Worker', () => {
  const sandbox = sinon.createSandbox();
  let context;
  let worker;
  let mockConsumer;
  let mockInstance;

  beforeEach(() => {
    mockConsumer = {
      connect: sinon.stub().returns(Promise.resolve()),
      subscribe: sinon.stub().returns(Promise.resolve()),
      run: sinon.stub().returns(Promise.resolve())
    };
    mockInstance = {
      consumer: () => (mockConsumer)
    };
    context = {
      config: {
        kafka: {
          sasl: {},
          topics: {}
        }
      }
    };

    sandbox.stub(kafka, 'Kafka').returns(mockInstance);
    worker = new Worker(context);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a customer instance when constructed', () => {
    expect(kafka.Kafka.calledOnce).to.be.true;
  });

  it('should run customer when worker is started', async () => {
    worker._handleMessage = () => ({});

    await worker.start();
    expect(mockConsumer.run.calledOnce).to.be.true;
  });

  describe('_handleMessage', () => {
    it('should throw error when a message is not a valid json response', () => {
      const wrongMessage = 'abc';

      expect(worker._handleMessage(context)(wrongMessage)).to.eventually.rejected;
    });
  });

});
