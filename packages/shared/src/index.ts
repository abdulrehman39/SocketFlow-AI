import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const ApiKeySchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;

export const ChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});

export type Channel = z.infer<typeof ChannelSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  userId: z.string(),
  channelId: z.string(),
  createdAt: z.date(),
});

export type Message = z.infer<typeof MessageSchema>;

export const SendEventInputSchema = z.object({
  user_id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
});

export type SendEventInput = z.infer<typeof SendEventInputSchema>;

export const BroadcastInputSchema = z.object({
  type: z.string(),
  data: z.record(z.any()),
});

export type BroadcastInput = z.infer<typeof BroadcastInputSchema>;
