import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';

import { createServer } from './server.js';

describe('PAJEMPLOI', function () {
  describe('PUT /agrement', function () {
    describe('if the person exists', function () {
      it('should return OK (200)', async function () {
        // given
        const server = await createServer();

        // when
        const name = 'Jane';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { name } };
        const { statusCode } = await server.inject(query);

        // then
        expect(statusCode).to.equal(StatusCodes.OK);
      });
      it('should return his history', async function () {
        // given
        const server = await createServer();

        // when
        const name = 'Jane';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { name } };
        const { payload } = await server.inject(query);
        const actual = JSON.parse(payload);

        // then
        expect(actual).to.deep.equal({ nom: 'Jane', type: 'maternel' });
      });
    });
    describe('if the person does not exist', function () {
      it('should return NOT FOUND (404)', async function () {
        // given
        const server = await createServer();

        // when
        const name = 'Jack';
        const query = { method: 'PUT', url: '/pajemploi/agrement', payload: { name } };
        const { statusCode } = await server.inject(query);

        // then
        expect(statusCode).to.equal(StatusCodes.NOT_FOUND);
      });
    });
  });
});
