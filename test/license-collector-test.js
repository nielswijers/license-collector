import chai, { expect } from 'chai';
import sinon from 'sinon';
import { licenseCollector } from '../src/license-collector';
import proxyquire from 'proxyquire';
import fs from 'fs';

chai.use(require('sinon-chai'));

describe('license collector', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get a list of packages from npm file', async() => {
    const result = await licenseCollector(`${__dirname}/fixtures/test-project-node-only`);
    expect(result[0]).to.have.all.keys(
      'name',
      'version',
      'licenseText',
      'type'
    );
  });

  it('should get a list of packages from bower file', async() => {
    const result = await licenseCollector(`${__dirname}/fixtures/test-project-bower-only`);
    expect(result[0]).to.contain.all.keys('name', 'version', 'licenseText');
  });

  it('should get a list of packages from bower and npm', async() => {
    const result = await licenseCollector(`${__dirname}/fixtures/test-project`);
    expect(result).to.have.lengthOf(4);
  });

  it('should give feedback if there are licenses missing and verbose is enabled', async() => {
    const spy = sandbox.spy(console, 'warn');
    const lc = proxyquire('../src/license-collector', {
      './get-packages': {
        getPackages: () => [{ licenseText: undefined }],
      },
    }).licenseCollector;
    await lc(`${__dirname}/fixtures/test-project`, { verbose: true });
    expect(spy).to.have.been.called;
  });

  it('should not give feedback if there are no licenses missing and verbose is enabled', async() => {
    const spy = sandbox.spy(console, 'warn');
    const lc = proxyquire('../src/license-collector', {
      './get-packages': {
        getPackages: () => [{ licenseText: 'with text' }],
      },
    }).licenseCollector;
    await lc(`${__dirname}/fixtures/test-project`, { verbose: true });
    expect(spy).to.not.have.been.called;
  });

  it('should search for other potential licenses', async() => {
    const spy = sandbox.spy(console, 'warn');
    await licenseCollector(`${__dirname}/fixtures/test-project-node-only`, {
      licensePatterns: ['*license*', '*readme*'],
      verbose: true,
    });
    expect(spy).to.not.have.been.called;
  });

  it('should complete the list with prefilled licenses', async() => {
    const spy = sandbox.spy(console, 'warn');
    await licenseCollector(`${__dirname}/fixtures/test-project-custom-licenses`, {
      verbose: true,
    });
    expect(spy).to.not.have.been.called;
  });

  it('should write a licenses.yml', async() => {
    const output = 'licenses.yml';
    const directory = `${__dirname}/fixtures/test-project-node-only`;
    const file = `${directory}/${output}`;
    await licenseCollector(directory, { output });
    fs.readFileSync(file, 'utf8');
    fs.unlinkSync(file);
  });

  it('should write a licenses.json', async() => {
    const output = 'licenses.json';
    const directory = `${__dirname}/fixtures/test-project-node-only`;
    const file = `${directory}/${output}`;
    await licenseCollector(directory, { output });
    fs.readFileSync(file, 'utf8');
    fs.unlinkSync(file);
  });

  it('should not break on missing package folder', async() => {
    const spy = sandbox.spy(console, 'warn');
    await licenseCollector(`${__dirname}/fixtures/test-project-missing-package/sub`, {
      verbose: true,
    });
    expect(spy).to.have.been.called;
  });
});
