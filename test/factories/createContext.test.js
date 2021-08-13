const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const factories = require('../../src/factories');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('createContext', () => {
  let config;
  let logger;

  beforeEach(() => {
    config = {
      name: 'abc',
        version: 'abc',
        http: { customer: 'abc', notification: 'dev' }
    };
    logger = {
      debug: sinon.stub(),
      info: sinon.stub(),
      error: sinon.stub()
    }
  });

  it('should return correct context when called',  () => {
    const context = factories.createContext(config, logger);

    expect(context).to.have.all.keys(
      'connectors', 'config', 'logger'
    )
  });
});
