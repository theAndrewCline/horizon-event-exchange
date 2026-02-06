import { z } from "zod";

//
// ASSET
//

export const AssetSchema = z.object({
  id: z.string().ulid(),
  name: z.string(),
  price: z.number(),
  updatedAt: z.string(),
});

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

//
// MESSAGE
//

export const createAssetMessageSchema = z.object({
  type: z.literal("CREATE_ASSET"),
  input: CreateAssetSchema,
});

export const updateAssetMessageSchema = z.object({
  type: z.literal("UPDATE_ASSET"),
  id: z.string().ulid(),
  input: UpdateAssetSchema,
});

export const currentAssetsMessageSchema = z.object({
  type: z.literal("CURRENT_ASSETS"),
  assets: z.array(AssetSchema),
});

export const MessageSchema = z.discriminatedUnion("type", [
  createAssetMessageSchema,
  updateAssetMessageSchema,
  currentAssetsMessageSchema,
]);

export type CurrentAssetsMessage = z.infer<typeof currentAssetsMessageSchema>;
export type CreateAssetMessage = z.infer<typeof createAssetMessageSchema>;
export type UpdateAssetMessage = z.infer<typeof updateAssetMessageSchema>;
