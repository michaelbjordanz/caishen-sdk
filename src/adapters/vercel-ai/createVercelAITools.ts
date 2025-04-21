import { getToolsFromCaishen } from "../../tools/getToolsFromCaishen";
import { CaishenSDK } from "../../caishen";

export async function createVercelAITools({ sdk }: { sdk: CaishenSDK }) {
  const tools = await getToolsFromCaishen({ sdk });

  const vercelAITools = tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters, // Zod schema (can later transform to OpenAI JSON if needed)
    execute: async (params: any) => {
      return await tool.execute(params);
    },
  }));

  return vercelAITools;
}
