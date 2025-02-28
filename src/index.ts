import axios from 'axios';

const BASE_URL = 'https://build.caishen.xyz';

export class CaishenSDK {
  
  private projectKey: string;
  private agentToken: string | null = null;
  private userToken: string | null = null;
  private connectedAs: 'agent' | 'user' | null = null;

  constructor(projectKey: string) {
    if (!projectKey) {
      throw new Error('Project key is required');
    }
    this.projectKey = projectKey;
  }

  async connectAsAgent(agentId?: string, userId?: string): Promise<string> {
    if (this.connectedAs) {
      throw new Error('Already connected as a user or agent. Create a new instance to connect again.');
    }
    try {
      const response = await axios.post<{ agentToken: string }>(
        `${BASE_URL}/auth/agents/connect`,
        { agentId, userId },
        { headers: { projectKey: this.projectKey } }
      );
      this.agentToken = response.data.agentToken;
      this.connectedAs = 'agent';
      return this.agentToken;
    } catch (error: any) {
      throw new Error(`Agent authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async connectAsUser(provider: string, token: string): Promise<string> {
    if (this.connectedAs) {
      throw new Error('Already connected as a user or agent. Create a new instance to connect again.');
    }
    try {
      const response = await axios.post<{ userToken: string }>(
        `${BASE_URL}/auth/users/connect`,
        { provider, token },
        { headers: { projectKey: this.projectKey } }
      );
      this.userToken = response.data.userToken;
      this.connectedAs = 'user';
      return this.userToken;
    } catch (error: any) {
      throw new Error(`User authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getWallet(chainType: string, account: number): Promise<any> {
    if (!chainType || account === undefined) {
      throw new Error('Chain type and account number are required');
    }
    const authToken = this.agentToken || this.userToken;
    if (!authToken) {
      throw new Error('Authenticate as an agent or user before fetching wallets');
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/wallets`,
        {
          params: { chainType, account },
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get wallet: ${error.response?.data?.message || error.message}`);
    }
  }
}

export default CaishenSDK;
