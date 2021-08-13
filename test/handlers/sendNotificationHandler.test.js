const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const { sendNotificationHandler } = require('../../src/handlers');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('sendNotificationHandler', () => {
  const sandbox = sinon.createSandbox();
  let context;
  let payload;

  beforeEach(() => {
    payload = {
      deleted: false,
      payment_id: '123123123',
      payment_code: 'XYZ123',
      amount: '50000',
      paid_at: '2020-10-17 07:41:33.866Z',
      external_id: 'order-123',
      notification_id: 'abc-def',
      customer_id: 'MAJU_CORP_PASAR_MINGGU',
      is_delivered: false,
    };

    const mockCustomer = {
      callback_url: 'http://maju.com/callback',
      authentication_key: '123',
    };

    context = {
      logger: { error: sandbox.stub(), info: sandbox.stub() },
      connectors: {
        customerConnector: { getCustomer: sandbox.stub().resolves(mockCustomer) },
        notificationConnector: { markAsComplete: sandbox.stub().resolves() },
        callbackConnector: { request: sandbox.stub().resolves() },
      },
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call getCustomer correctly to get customer data', async () => {
    await sendNotificationHandler(context, payload);

    expect(context.connectors.customerConnector.getCustomer).to.be.calledWith(payload.customer_id);
  });

  it('should call callbackConnector correctly to trigger callback', async () => {
    await sendNotificationHandler(context, payload);

    expect(context.connectors.callbackConnector.request.firstCall.args).to.deep.eq([
      {
        amount: '50000',
        authentication_key: '123',
        callback_url: 'http://maju.com/callback',
        customer_id: 'MAJU_CORP_PASAR_MINGGU',
        deleted: false,
        external_id: 'order-123',
        is_delivered: false,
        notification_id: 'abc-def',
        paid_at: '2020-10-17 07:41:33.866Z',
        payment_code: 'XYZ123',
        payment_id: '123123123',
      },
    ]);
  });

  it('should call getCustomer correctly to get customer data', async () => {
    await sendNotificationHandler(context, payload);

    expect(context.connectors.notificationConnector.markAsComplete).to.be.calledWith(payload.notification_id);
  });

  it('should not call customer connector when is testing is true', async () => {
    await sendNotificationHandler(context, {
      ...payload,
      is_testing: true,
    });

    expect(context.connectors.customerConnector.getCustomer.called).to.eq(false);
  });

  it('should log error when happends and not throw error forward', async () => {
    context.connectors.customerConnector.getCustomer.rejects(new Error('Random Error'));
    await sendNotificationHandler(context, {
      ...payload,
      is_testing: true,
    });

    expect(context.logger.error.calledOnce).to.eq(false);
  });
});
