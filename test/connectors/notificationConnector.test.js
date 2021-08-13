const { expect, use } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const mockdate = require('mockdate');
const { StatusCodes } = require('http-status-codes');

const { NotificationConnector } = require('../../src/connectors');

use(sinonChai);
use(chaiAsPromised);

describe('NotificationConnector', () => {
  const sandbox = sinon.createSandbox();
  let opts;
  let notificationConnector;

  beforeEach(() => {
    opts = {
      httpRequest: sandbox.stub().resolves({ body: {}, statusCode: StatusCodes.OK }),
      logger: { debug: () => ({}) },
      headers: {},
    };
    notificationConnector = new NotificationConnector(opts);
  });

  afterEach(() => {
    sandbox.restore();
    mockdate.reset();
  });

  describe('#markAsComplete', () => {
    it('should call update function with expected params', async () => {
      const customerId = '1234AA';

      await notificationConnector.markAsComplete(customerId);
      expect(opts.httpRequest.calledOnce).to.eq(true);
    });

    it('should reject correct error when httpRequest rejects', async () => {
      opts.httpRequest.resolves({ statusCode: StatusCodes.NOT_FOUND });
      const customerId = '1234AA';

      try {
        await notificationConnector.markAsComplete(customerId);

        expect.fail();
      } catch (e) {
        expect(e).to.be.instanceOf(Error).and.haveOwnProperty('message', `Error notifying success for id: ${customerId}`);
      }
    });
  });
});
