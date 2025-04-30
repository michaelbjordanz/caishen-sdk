import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { CaishenSDK } from '../../caishen';
import { getTools } from '../../tools/get-tools';

export async function createLangchainTools({ sdk }: { sdk: CaishenSDK }) {
  const tools = getTools({ sdk });

  return Object.values(tools).map((t) =>
    tool(
      async (arg) => {
        const execute = t.execute as unknown as (
          params: z.infer<typeof t.parameters>,
        ) => Promise<ReturnType<typeof t.execute>>;
        return await execute(arg);
      },
      {
        name: t.name,
        description: t.description,
        schema: t.parameters,
      },
    ),
  );
}
