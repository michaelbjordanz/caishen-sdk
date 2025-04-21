import { type GetToolsParams, type ToolBase, type WalletClientBase, getTools } from "../../core";

import { tool } from "@langchain/core/tools";
import type { z } from "zod";

export type CreateLangChainToolsParams<TWalletClient extends WalletClientBase> = GetToolsParams<TWalletClient>;

export async function createLangChainTools<TWalletClient extends WalletClientBase>({
    wallet,
    plugins,
}: CreateLangChainToolsParams<TWalletClient>) {
    const tools: ToolBase[] = await getTools({ wallet, plugins });

    return tools.map((t) =>
        tool(
            async (arg: z.output<typeof t.parameters>) => {
                return JSON.stringify(await t.execute(arg));
            },
            {
                name: t.name,
                description: t.description,
                schema: t.parameters,
            },
        ),
    );
}
