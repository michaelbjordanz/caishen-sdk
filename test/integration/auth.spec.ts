import 'dotenv/config';
import env from 'env-var';
import * as assert from 'assert';

import { CaishenSDK } from '../../src';

describe('Integration: SDK Authorization', function () {
  describe('Connect As User', () => {
    const sdk = new CaishenSDK({
      projectKey: env.get('PROJECT_KEY').required().asString(),
    });

    const provider = env.get('USER_PROVIDER').default('custom').asString();
    const token = env.get('USER_TOKEN').required().asString();

    // TODO: add more providers as list (not via env)
    it(`should connect as user (${provider} provider)`, async () => {
      const authToken = await sdk.connectAsUser({
        token,
        provider,
      });

      assert.strictEqual(
        typeof authToken,
        'string',
        'should return auth token',
      );
    });
  });

  describe('Connect As Agent', () => {
    const sdk = new CaishenSDK({
      projectKey: env.get('PROJECT_KEY').required().asString(),
    });

    it('should connect as agent', async () => {
      const authToken = await sdk.connectAsAgent({
        agentId: env.get('AGENT_ID').required().asString(),
      });

      assert.strictEqual(
        typeof authToken,
        'string',
        'should return auth token',
      );
    });
  });
});
