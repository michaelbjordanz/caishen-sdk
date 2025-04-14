import axios from 'axios';
import { BASE_URL } from './constants';

import * as CASH from './cash';
import * as CRYPTO from './crypto';

type ModuleBind = {
  [key: string]: unknown;
};

type BoundFunctions<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? K
    : never]: T[K] extends (...args: infer A) => infer R
    ? (this: any, ...args: A) => R
    : never;
};

export class CaishenSDK {
  protected projectKey: string;
  protected agentToken: string | null = null;
  protected userToken: string | null = null;
  protected connectedAs: 'agent' | 'user' | null = null;

  cash: BoundFunctions<typeof CASH>;
  crypto: BoundFunctions<typeof CRYPTO>;

  constructor({ projectKey }: { projectKey: string }) {
    if (!projectKey) {
      throw new Error('Project key is required');
    }

    this.projectKey = projectKey;
    this.cash = this.bindModule(CASH);
    this.crypto = this.bindModule(CRYPTO);
  }

  private bindModule<T extends ModuleBind>(m: ModuleBind): BoundFunctions<T> {
    const bound: ModuleBind = {};

    for (const key of Object.keys(m)) {
      const fn = m[key];
      if (typeof fn === 'function') {
        bound[key] = fn.bind(this); // binds SDK context to each function
      }
    }

    return bound as BoundFunctions<T>;
  }

  async connectAsAgent({
    agentId,
    userId,
  }: {
    agentId?: string;
    userId?: string;
  }): Promise<string> {
    if (this.connectedAs) {
      throw new Error(
        'Already connected as a user or agent. Create a new instance to connect again.',
      );
    }
    try {
      const response = await axios.post<{ agentToken: string }>(
        `${BASE_URL}/auth/agents/connect`,
        { agentId, userId },
        { headers: { projectKey: this.projectKey } },
      );
      this.agentToken = response.data.agentToken;
      this.connectedAs = 'agent';
      return this.agentToken;
    } catch (error: any) {
      throw new Error(
        `Agent authentication failed: ${
          error.response?.data?.message || error.message
        }`,
      );
    }
  }

  async connectAsUser({
    provider,
    token,
  }: {
    provider: string;
    token: string;
  }): Promise<string> {
    if (this.connectedAs) {
      throw new Error(
        'Already connected as a user or agent. Create a new instance to connect again.',
      );
    }
    try {
      const response = await axios.post<{ userToken: string }>(
        `${BASE_URL}/auth/users/connect`,
        { provider, token },
        { headers: { projectKey: this.projectKey } },
      );
      this.userToken = response.data.userToken;
      this.connectedAs = 'user';
      return this.userToken;
    } catch (error: any) {
      throw new Error(
        `User authentication failed: ${
          error.response?.data?.message || error.message
        }`,
      );
    }
  }
}
