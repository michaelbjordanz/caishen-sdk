import type { z } from "zod";

export type ToolBase = {
  name: string;
  description: string;
  parameters: z.ZodTypeAny;
  execute: (params: any) => Promise<any>;
};