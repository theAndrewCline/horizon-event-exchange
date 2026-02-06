import { z } from "zod";

export const CreateAssetSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
});

export const UpdateAssetSchema = z.object({
  price: z.number().min(0),
});

export const DatabaseRowSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    updated_at: z.string(),
  })
  .transform((row) => ({
    id: row.id,
    name: row.name,
    price: row.price,
    updatedAt: row.updated_at,
  }));

export type CreateAssetInput = z.infer<typeof CreateAssetSchema>;
export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>;
export type DatabaseRow = z.infer<typeof DatabaseRowSchema>;
