import chai from 'chai';
import { BasePlugin } from '../lib/BasePlugin';

chai.expect();
chai.use(require('chai-properties'));

const expect = chai.expect;

var lib;


describe('Given an instance of ImageUtils', function () {
  before(function () {
    lib = new BasePlugin();
  });
  describe('LFit test 1', function () {
    it('should run correctly', () => {
      let size = new Dimension(400,300);
      let maxSize = new Dimension(128,128);

      expect(lib.fit(size, maxSize)).to.have.properties({width: 128, height: 96});
    });
  });
  describe('LFit test 2', function () {
    it('should run correctly', () => {
      let size = new Dimension(400,300);
      let maxSize = new Dimension(1280,1280);

      expect(lib.fit(size, maxSize)).to.have.properties({width: 1280, height: 960});
    });
  });
  describe('LFit test 3', function () {
    it('should throw correct error', () => {
      let size = new Dimension(400,300);
      let maxSize = new Dimension(0,0);

      expect(lib.fit.bind(lib, size, maxSize)).to.throw(/must be > 0/);
      expect(lib.fit.bind(lib, size, maxSize)).to.not.throw(/mustn't be > 0/);
    });
  });
});