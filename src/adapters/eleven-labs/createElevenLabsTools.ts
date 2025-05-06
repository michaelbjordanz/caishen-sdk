import { z } from 'zod';
import { CaishenSDK } from '../../caishen';
import { getTools } from '../../tools/get-tools';

type Tool<T extends z.ZodTypeAny, R> = (params: z.infer<T>) => Promise<R>;

export async function createElevenLabsTools({ sdk }: { sdk: CaishenSDK }) {
  const tools = await getTools({ sdk });

  return Object.values(tools).reduce((acc, tool) => {
    acc[tool.name] = async (params: any) => {
      return await tool.execute(params);
    };
    return acc;
  }, {} as Record<string, Tool<any, any>>);
}
