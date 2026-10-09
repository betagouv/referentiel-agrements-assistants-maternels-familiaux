import { expect, test } from '@playwright/test';
import { expect as chaiExpect } from 'chai';

test.describe('/api endpoint', () => {
  test('returns OK (200)', async ({ request }) => {
    // when
    const healthcheck = await request.get(`/api`);

    // then
    expect(healthcheck.ok()).toBeTruthy();
  });
  test("returns the database status as 'up'", async ({ request }) => {
    // when
    const response = await request.get(`/api`);

    // then
    const payload = await response.json();
    chaiExpect(payload).to.deep.equal({
      name: 'referentiel-national-agrements',
      version: '0.0.0',
      resources: { database: { status: 'up' } },
    });
  });
});
