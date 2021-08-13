const { expect, use } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const mockdate = require('mockdate');
const { StatusCodes } = require('http-status-codes');

const { CallbackConnector } = require('../../src/connectors');

use(sinonChai);
use(chaiAsPromised);

describe('CallbackConnector', () => {
  const sandbox = sinon.createSandbox();
  let opts;
  let callbackConnector;

  beforeEach(() => {
    opts = {
      httpRequest: sandbox.stub().resolves({ body: {}, statusCode: StatusCodes.OK }),
      logger: { debug: () => ({}) },
      headers: {}
    };
    callbackConnector = new CallbackConnector(opts);
  });

  afterEach(() => {
    sandbox.restore();
    mockdate.reset();
  });

  describe('#request', () => {
    it('should call update function with expected params', async () => {
      const customerId = '1234AA';

      await callbackConnector.request(customerId);
      expect(opts.httpRequest.calledOnce).to.be.true;
    });

    it('should reject correct error when httpRequest rejects', async () => {
      opts.httpRequest.resolves({ statusCode: StatusCodes.NOT_FOUND });
      const customerId = '1234AA';

      try {
        await callbackConnector.request(customerId);

        expect.fail();
      } catch (e) {
        expect(e).to.be.instanceOf(Error)
        .and.haveOwnProperty('message', `Error notifying success for id: ${customerId}`);
      }
    });
  });
});
