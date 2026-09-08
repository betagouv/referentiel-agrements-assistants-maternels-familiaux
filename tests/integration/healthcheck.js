import { expect } from 'chai';

describe('Integration | Route | healthcheck', function () {
  describe('GET /healthcheck', function () {
    it('should return OK (200)', async function () {
      // given

      // when
      const responseCode = 500;

      // then
      expect(responseCode).to.equal(200);
    });
  });
});
