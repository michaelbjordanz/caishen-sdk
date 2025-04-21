import { getToolsFromCaishen } from "../../tools/getToolsFromCaishen";
import { CaishenSDK } from "../../caishen";

export async function createElevenLabsTools({ sdk }: { sdk: CaishenSDK }) {
  const tools = await getToolsFromCaishen({ sdk });

  const elevenLabTools: Record<string, (params: any) => Promise<any>> = {};

  for (const tool of tools) {
    elevenLabTools[tool.name] = async (params: any) => {
      return await tool.execute(params);
    };
  }

  return elevenLabTools;
}
