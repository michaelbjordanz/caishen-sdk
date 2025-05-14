import axios from 'axios';
import { BASE_URL } from './constants';

import * as CASH from './cash';
import * as CRYPTO from './crypto';
import { ConnectAsAgentPayload, ConnectAsUserPayload, InitCaishenSDK } from './types';

type ModuleBind = {
  [key: string]: unknown;
};

type BoundFunctions<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? K
    : never]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => R
    : never;
};

export class CaishenSDK {
  protected projectKey: string;
  protected agentToken: string | null = null;
  protected userToken: string | null = null;
  protected connectedAs: 'agent' | 'user' | null = null;

  cash: BoundFunctions<typeof CASH>;
  crypto: BoundFunctions<typeof CRYPTO>;

  constructor(initData: InitCaishenSDK) {
    this.projectKey = initData.projectKey;
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

  async connectAsAgent(payload: ConnectAsAgentPayload): Promise<string> {
    const {
      agentId,
      userId,
      storeAuthToken = true,
    } = payload;

    if (storeAuthToken && this.connectedAs) {
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
      const authToken = response.data.agentToken;

      if (storeAuthToken) {
        this.userToken = authToken;
        this.connectedAs = 'agent';
      }

      return authToken;
    } catch (error: any) {
      throw new Error(
        `Agent authentication failed: ${
          error.response?.data?.message || error.message
        }`,
      );
    }
  }

  async connectAsUser(payload: ConnectAsUserPayload): Promise<string> {
    const {
      token,
      provider= 'custom',
      storeAuthToken = true,
    } = payload;

    if (storeAuthToken && this.connectedAs) {
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
      const authToken = response.data.userToken;

      if (storeAuthToken) {
        this.userToken = authToken;
        this.connectedAs = 'user';
      }

      return authToken;
    } catch (error: any) {
      throw new Error(
        `User authentication failed: ${
          error.response?.data?.message || error.message
        }`,
      );
    }
  }
}
