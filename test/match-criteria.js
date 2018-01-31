const expect = require('chai').expect;
const confbits = require('../index');

const path = require('path');
const co = require('co');
const fs = require('co-fs');

const loadBits = (folderPath) => (
  co(function* () {
    const files = yield fs.readdir(folderPath);

    const bits = [];
    for (let i=0; i<files.length; i++) {
      const filePath = path.join(folderPath, files[i]);
      try {
        const json = yield fs.readFile(filePath, 'utf8');
        bits.push(JSON.parse(json));
      }
      catch (error) {
        console.error('Failed to load', filePath);
      }
    }

    return bits;
  })
);

describe('Match subject against criteria', function() {
  const conf = confbits({});
  before(function(done) {
    loadBits(`${__dirname}/bits`).then((bits) => {
      conf.set(bits);
      done();
    });
  });

  it('Subject should match no criteria and get default bit', function() {
    const res = conf.get();
    expect(res).to.exist;
    expect(res.common).to.exist;
    expect(res.common.field).to.eq('common');
    expect(res.namespace1).to.exist;
    expect(res.namespace1.field1).to.eq('default');
  });

  it('Subject should match criteria tag 1', function() {
    const subject = { tags: ['a', 'c'] };
    const res = conf.get(subject);
    expect(res).to.exist;
    expect(res.common).to.exist;
    expect(res.common.field).to.eq('common');
    expect(res.namespace1).to.exist;
    expect(res.namespace1.field1).to.eq('1');
  });

  it('Subject should match criteria 1 and 2', function() {
    const subject = { tags: ['a', 'b'], country: 'DE' };
    const res = conf.get(subject);
    expect(res).to.exist;
    expect(res.common).to.exist;
    expect(res.common.field).to.eq('common');
    expect(res.namespace1).to.exist;
    expect(res.namespace1.field1).to.eq('1');
    expect(res.namespace2).to.exist;
    expect(res.namespace2.field1).to.eq('2');
    expect(res.namespace3).to.exist;
    expect(res.namespace3.field1).to.eq('2');
  });
})
