import type { z } from 'zod';

export function toolBase<T extends z.ZodTypeAny, R>({
  name,
  description,
  parameters,
  execute,
}: {
  name: string;
  description: string;
  parameters: T;
  execute: (params: z.infer<T>) => Promise<R>;
}) {
  return {
    name,
    description,
    parameters,
    execute,
  };
}
