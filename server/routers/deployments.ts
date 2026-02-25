import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getProjectById,
  createDeployment,
  getDeploymentById,
  updateDeploymentStatus,
  addBuildLog,
  getDeploymentsByProjectId,
} from "../db";
import { nanoid } from "nanoid";

/**
 * Generate a unique deployment URL
 */
function generateDeploymentUrl(projectId: number): string {
  const id = nanoid(8);
  return `https://deploy-${projectId}-${id}.vercel-clone.app`;
}

/**
 * Simulate build process (in production, this would execute actual builds)
 */
async function executeBuild(
  deploymentId: number,
  projectId: number,
  onLog: (message: string, level: "info" | "warning" | "error" | "success") => Promise<void>
): Promise<boolean> {
  try {
    await onLog("Starting build process...", "info");
    await onLog("Installing dependencies...", "info");

    // Simulate dependency installation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await onLog("Dependencies installed successfully", "success");

    await onLog("Running build command...", "info");

    // Simulate build
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await onLog("Build completed successfully", "success");

    await onLog("Optimizing assets...", "info");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await onLog("Assets optimized", "success");

    await onLog("Deployment ready", "success");
    return true;
  } catch (error) {
    await onLog(`Build failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
    return false;
  }
}

export const deploymentsRouter = router({
  /**
   * Create a new deployment for a project
   */
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        branch: z.string().default("main"),
        commitSha: z.string(),
        commitMessage: z.string().optional(),
        commitAuthor: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user owns the project
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }

      // Create deployment record
      const deploymentUrl = generateDeploymentUrl(input.projectId);
      const result = await createDeployment({
        projectId: input.projectId,
        deploymentUrl,
        branch: input.branch,
        commitSha: input.commitSha,
        commitMessage: input.commitMessage,
        commitAuthor: input.commitAuthor,
        status: "pending",
      });

      const deploymentId = (result as any).insertId || 0;

      // Start build process asynchronously
      startBuildProcess(deploymentId, input.projectId, ctx.user.id).catch((error) => {
        console.error("Build process error:", error);
      });

      return {
        success: true,
        deploymentId,
        deploymentUrl,
      };
    }),

  /**
   * Get deployment details
   */
  getById: protectedProcedure
    .input(z.object({ deploymentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const deployment = await getDeploymentById(input.deploymentId);
      if (!deployment) {
        throw new Error("Deployment not found");
      }

      // Verify user owns the project
      const project = await getProjectById(deployment.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Deployment not found or unauthorized");
      }

      return deployment;
    }),

  /**
   * Get all deployments for a project
   */
  listByProject: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      // Verify user owns the project
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }

      const deployments = await getDeploymentsByProjectId(input.projectId);
      return deployments || [];
    }),

  /**
   * Rollback to a previous deployment
   */
  rollback: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        deploymentId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user owns the project
      const project = await getProjectById(input.projectId);
      if (!project || project.userId !== ctx.user.id) {
        throw new Error("Project not found or unauthorized");
      }

      const deployment = await getDeploymentById(input.deploymentId);
      if (!deployment || deployment.projectId !== input.projectId) {
        throw new Error("Deployment not found");
      }

      // Create a new deployment based on the previous one
      const newDeploymentUrl = generateDeploymentUrl(input.projectId);
      const result = await createDeployment({
        projectId: input.projectId,
        deploymentUrl: newDeploymentUrl,
        branch: deployment.branch,
        commitSha: deployment.commitSha,
        commitMessage: `Rollback to ${deployment.commitSha.substring(0, 7)}`,
        commitAuthor: deployment.commitAuthor,
        status: "success", // Rollbacks are instant since we're reusing built artifacts
      });

      return {
        success: true,
        deploymentId: (result as any).insertId || 0,
        deploymentUrl: newDeploymentUrl,
      };
    }),
});

/**
 * Execute build process in background
 */
async function startBuildProcess(deploymentId: number, projectId: number, userId: number) {
  try {
    // Update status to building
    await updateDeploymentStatus(deploymentId, "building");

    const startTime = Date.now();

    // Execute build with logging
    const success = await executeBuild(deploymentId, projectId, async (message, level) => {
      await addBuildLog({
        deploymentId,
        message,
        level,
      });
    });

    const buildDuration = Date.now() - startTime;

    // Update deployment status
    const finalStatus = success ? "success" : "failed";
    await updateDeploymentStatus(deploymentId, finalStatus);

    // Update build duration
    const deployment = await getDeploymentById(deploymentId);
    if (deployment) {
      // In a real implementation, you'd update the deployment with the duration
      console.log(`Deployment ${deploymentId} completed with status ${finalStatus} in ${buildDuration}ms`);
    }
  } catch (error) {
    console.error("Build process error:", error);
    await updateDeploymentStatus(deploymentId, "failed");
  }
}
