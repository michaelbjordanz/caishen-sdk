import { tool, ToolSet } from 'ai';
import { z } from 'zod';
import { CaishenSDK } from '../../caishen';
import { getTools } from '../../tools/get-tools';

export async function createVercelAITools({ sdk }: { sdk: CaishenSDK }) {
  const tools = await getTools({ sdk });

  const vercelAITools = Object.values(tools).reduce((acc, t) => {
    acc[t.name] = tool({
      description: t.description,
      parameters: t.parameters,
      execute: async (params) => {
        const execute = t.execute as unknown as (
          params: z.infer<typeof t.parameters>,
        ) => Promise<ReturnType<typeof t.execute>>;
        return await execute(params);
      },
    });
    return acc;
  }, {} as ToolSet);

  return vercelAITools;
}
