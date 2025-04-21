import { type GetToolsParams, type ToolBase, type WalletClientBase, getTools } from "../../core";

import { type CoreTool, tool } from "ai";
import type { z } from "zod";

export type CreateVercelAIToolsParams<TWalletClient extends WalletClientBase> = GetToolsParams<TWalletClient>;

export async function createVercelAITools<TWalletClient extends WalletClientBase>({
    wallet,
    plugins,
}: CreateVercelAIToolsParams<TWalletClient>) {
    const tools: ToolBase[] = await getTools<TWalletClient>({
        wallet,
        plugins,
    });

    const aiTools: { [key: string]: CoreTool } = {};

    for (const t of tools) {
        aiTools[t.name] = tool({
            description: t.description,
            parameters: t.parameters,
            execute: async (arg: z.output<typeof t.parameters>) => {
                return await t.execute(arg);
            },
        });
    }

    return aiTools;
}
