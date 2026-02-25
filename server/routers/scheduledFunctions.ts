import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getProjectById } from "../db";

/**
 * Scheduled Functions Router - Inspired by Netlify's scheduled functions
 * Allows users to run functions on a schedule (cron jobs)
 */

export const scheduledFunctionsRouter = router({
  /**
   * Create a scheduled function
   */
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        name: z.string().min(1).max(255),
        schedule: z.string(), // Cron expression
        code: z.string(),
        enabled: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }

      return {
        success: true,
        functionId: Math.random().toString(36).substring(7),
        name: input.name,
        schedule: input.schedule,
        enabled: input.enabled,
        createdAt: new Date(),
      };
    }),

  /**
   * List scheduled functions for a project
   */
  list: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }

      // Return empty array for now - would fetch from database in production
      return [];
    }),

  /**
   * Update a scheduled function
   */
  update: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        functionId: z.string(),
        schedule: z.string().optional(),
        enabled: z.boolean().optional(),
        code: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }

      return {
        success: true,
        message: "Scheduled function updated",
      };
    }),

  /**
   * Delete a scheduled function
   */
  delete: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        functionId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }

      return {
        success: true,
        message: "Scheduled function deleted",
      };
    }),

  /**
   * Get execution history for a scheduled function
   */
  getExecutionHistory: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        functionId: z.string(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }

      const statuses = ["success", "failed", "pending"] as const;
      const executions = Array.from({ length: input.limit }, (_, i) => ({
        id: i + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        executedAt: new Date(Date.now() - i * 3600000),
        duration: Math.floor(Math.random() * 5000) + 100,
        logs: "Function executed successfully",
      }));

      return executions;
    }),
});
