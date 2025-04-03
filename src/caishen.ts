import axios from "axios";
import { BASE_URL } from "./constants";

import * as CASH from "./cash";
import * as CRYPTO from "./crypto";

export class CaishenSDK {

  private projectKey: string;
  private agentToken: string | null = null;
  private userToken: string | null = null;
  private connectedAs: "agent" | "user" | null = null;

  public cash: Record<string, any>;   
  public crypto: Record<string, any>;

  constructor({ projectKey }: { projectKey: string }) {
    if (!projectKey) {
      throw new Error("Project key is required");
    }
    this.projectKey = projectKey;

    this.cash = {};
    this.crypto = {};

    this.initializeModules();
  }

  private initializeModules() {
    this.cash = this.bindModule(CASH);
    this.crypto = this.bindModule(CRYPTO);
  }

  private bindModule(module: Record<string, any>) {
    const bound: Record<string, any> = {};
    for (const key of Object.keys(module)) {
      const fn = module[key];
      if (typeof fn === "function") {
        bound[key] = fn.bind(this); // binds SDK context to each function
      }
    }
    return bound;
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
        "Already connected as a user or agent. Create a new instance to connect again."
      );
    }
    try {
      const response = await axios.post<{ agentToken: string }>(
        `${BASE_URL}/auth/agents/connect`,
        { agentId, userId },
        { headers: { projectKey: this.projectKey } }
      );
      this.agentToken = response.data.agentToken;
      this.connectedAs = "agent";
      return this.agentToken;
    } catch (error: any) {
      throw new Error(
        `Agent authentication failed: ${
          error.response?.data?.message || error.message
        }`
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
        "Already connected as a user or agent. Create a new instance to connect again."
      );
    }
    try {
      const response = await axios.post<{ userToken: string }>(
        `${BASE_URL}/auth/users/connect`,
        { provider, token },
        { headers: { projectKey: this.projectKey } }
      );
      this.userToken = response.data.userToken;
      this.connectedAs = "user";
      return this.userToken;
    } catch (error: any) {
      throw new Error(
        `User authentication failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
}
