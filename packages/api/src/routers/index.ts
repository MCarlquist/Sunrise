import type { RouterClient } from "@orpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../index";

const createCheckInInput = z.object({
  mood: z.enum(["Happy", "Sad", "Angry", "Stressed"]),
  influence: z.enum([
    "Sleep",
    "Work",
    "Weather",
    "Relationships",
    "Being-Proud",
    "Self-Recovery",
  ]),
  wellbeingScore: z.number().int().min(1).max(10),
  notes: z.string().trim().max(2000),
});

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private dashboard",
      user: context.session?.user,
    };
  }),
  createCheckIn: protectedProcedure
    .input(createCheckInInput)
    .handler(async ({ context, input }) => {
      const checkIn = {
        userId: context.session.user.id,
        ...input,
        createdAt: new Date(),
      };
      const result = await context.db.collection("checkIns").insertOne(checkIn);

      return {
        id: result.insertedId.toString(),
        ...checkIn,
      };
    }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
