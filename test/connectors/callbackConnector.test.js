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
  let payload;
  let callbackConnector;

  beforeEach(() => {
    payload = {
      deleted: false,
      payment_id: '123123123',
      payment_code: 'XYZ123',
      amount: '50000',
      paid_at: '2020-10-17 07:41:33.866Z',
      external_id: 'order-123',
      authentication_key: '123',
      notification_id: 'abc-def',
      customer_id: 'MAJU_CORP_PASAR_MINGGU',
      callback_url: 'http://maju.com/callback',
      is_delivered: false,
    };
    opts = { httpRequest: sandbox.stub().resolves({ statusCode: StatusCodes.OK }), logger: { debug: () => {} } };
    callbackConnector = new CallbackConnector(opts);
  });

  afterEach(() => {
    sandbox.restore();
    mockdate.reset();
  });

  describe('#request', () => {
    it('should call httpRequest with correct params', async () => {
      await callbackConnector.request(payload);
      expect(opts.httpRequest).to.be.calledWith({
        method: 'POST',
        url: 'http://maju.com/callback',
        headers: { 'x-idempotency-key': 'abc-def' },
        body: {
          deleted: false,
          payment_id: '123123123',
          payment_code: 'XYZ123',
          amount: '50000',
          paid_at: '2020-10-17 07:41:33.866Z',
          external_id: 'order-123',
          is_delivered: false,
          customer_id: 'MAJU_CORP_PASAR_MINGGU',
          authentication_key: '123',
        },
      });
    });

    it('should reject correct error when httpRequest rejects', async () => {
      opts.httpRequest.resolves({ statusCode: StatusCodes.NOT_FOUND });

      try {
        await callbackConnector.request(payload);

        expect.fail();
      } catch (e) {
        expect(e)
          .to.be.instanceOf(Error)
          .and.haveOwnProperty('message', `Error triggering callback for: ${payload.notification_id}`);
      }
    });
  });
});
