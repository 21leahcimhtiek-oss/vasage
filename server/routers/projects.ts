import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";  
import { getProjectsByUserId, getProjectById, createProject, getDeploymentsByProjectId } from "../db";

export const projectsRouter = router({
  /**
   * Get all projects for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const projects = await getProjectsByUserId(ctx.user.id);
    return projects || [];
  }),

  /**
   * Get a single project by ID
   */
  getById: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }
      return project;
    }),

  /**
   * Create a new project
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        githubRepoUrl: z.string().url(),
        githubRepoName: z.string(),
        githubOwner: z.string(),
        defaultBranch: z.string().default("main"),
        framework: z.string().optional(),
        buildCommand: z.string().optional(),
        installCommand: z.string().optional(),
        outputDirectory: z.string().optional(),
        rootDirectory: z.string().default("."),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await createProject({
        userId: ctx.user.id,
        ...input,
      });
      return result;
    }),

  /**
   * Get deployments for a project
   */
  getDeployments: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }
      const deployments = await getDeploymentsByProjectId(input.projectId);
      return deployments || [];
    }),
});
