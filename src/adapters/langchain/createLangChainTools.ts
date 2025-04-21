import { tool } from "@langchain/core/tools";
import { getToolsFromCaishen } from "../../tools/getToolsFromCaishen";
import { CaishenSDK } from "../../caishen";

export async function createLangchainTools({ sdk }: { sdk: CaishenSDK }) {
  const tools = await getToolsFromCaishen({ sdk });

  return tools.map((t) =>
    tool(
      async (arg: any) => {
        return await t.execute(arg);
      },
      {
        name: t.name,
        description: t.description,
        schema: t.parameters,
      },
    )
  );
}
