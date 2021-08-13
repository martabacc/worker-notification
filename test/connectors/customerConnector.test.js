const { expect, use } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const mockdate = require('mockdate');
const { StatusCodes } = require('http-status-codes');

const { CustomerConnector } = require('../../src/connectors');

use(sinonChai);
use(chaiAsPromised);

describe('CustomerConnector', () => {
  const sandbox = sinon.createSandbox();
  let opts;
  let customerConnector;

  beforeEach(() => {
    opts = {
      httpRequest: sandbox.stub().resolves({ body: {}, statusCode: StatusCodes.OK }),
      logger: { info: () => ({}) },
      headers: {},
    };
    customerConnector = new CustomerConnector(opts);
  });

  afterEach(() => {
    sandbox.restore();
    mockdate.reset();
  });

  describe('#getCustomer', () => {
    it('should call update function with expected params', async () => {
      const customerId = '1234AA';

      await customerConnector.getCustomer(customerId);
      expect(opts.httpRequest.calledOnce).to.be.true;
    });

    it('should reject correct error when httpRequest rejects', async () => {
      opts.httpRequest.resolves({ statusCode: StatusCodes.NOT_FOUND });
      const customerId = '1234AA';

      try {
        await customerConnector.getCustomer(customerId);

        expect.fail();
      } catch (e) {
        expect(e).to.be.instanceOf(Error).and.haveOwnProperty('message', `Error retrieving customer detail: ${customerId}`);
      }
    });
  });
});
