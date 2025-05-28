import axios from 'axios';

import { BASE_URL } from '../constants';
import { InvokeTool } from '../types';

export class McpClient {
  /**
   * Fetches all available MCP tools
   */
  async getAllTools() {
    const response = await axios.get(`${BASE_URL}/mcp/tools`);
    return response.data;
  }

  /**
   * Fetches schema for a specific tool
   */
  async getToolSchema(toolId: string) {
    const response = await axios.get(`${BASE_URL}/mcp/tools/${toolId}`);
    return response.data;
  }

  /**
   * Calls a tool endpoint with config obtained from `getToolSchema`.
   */
  async invokeTool(invokeToolDto: InvokeTool) {
    const response = await axios.post(`${BASE_URL}/mcp/invokeTool`, invokeToolDto);
    return response.data;
  }
}