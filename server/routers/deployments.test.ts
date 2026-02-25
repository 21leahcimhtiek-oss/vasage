import { describe, expect, it, beforeEach, vi } from "vitest";
import { deploymentsRouter } from "./deployments";
import type { TrpcContext } from "../_core/context";

// Mock database functions
vi.mock("../db", () => ({
  getProjectById: vi.fn(),
  createDeployment: vi.fn(),
  getDeploymentById: vi.fn(),
  updateDeploymentStatus: vi.fn(),
  addBuildLog: vi.fn(),
  getDeploymentsByProjectId: vi.fn(),
}));

import * as db from "../db";

function createAuthContext(userId: number = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const mockProject = {
  id: 1,
  userId: 1,
  name: "Test Project",
  description: "A test project",
  githubRepoUrl: "https://github.com/test/repo",
  githubRepoName: "repo",
  githubOwner: "test",
  defaultBranch: "main",
  framework: "next",
  buildCommand: "npm run build",
  installCommand: "npm install",
  outputDirectory: ".next",
  rootDirectory: ".",
  isPublic: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("deploymentsRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("creates a new deployment for a project", async () => {
      vi.mocked(db.getProjectById).mockResolvedValue(mockProject);
      vi.mocked(db.createDeployment).mockResolvedValue({ insertId: 1 } as any);

      const ctx = createAuthContext(1);
      const caller = deploymentsRouter.createCaller(ctx);

      const result = await caller.create({
        projectId: 1,
        commitSha: "abc123",
        commitMessage: "Initial commit",
        commitAuthor: "test",
      });

      expect(result.success).toBe(true);
      expect(result.deploymentId).toBeDefined();
      expect(result.deploymentUrl).toContain("deploy-1-");
      expect(db.createDeployment).toHaveBeenCalled();
    });

    it("throws error if user does not own the project", async () => {
      const otherUserProject = { ...mockProject, userId: 2 };
      vi.mocked(db.getProjectById).mockResolvedValue(otherUserProject);

      const ctx = createAuthContext(1);
      const caller = deploymentsRouter.createCaller(ctx);

      await expect(
        caller.create({
          projectId: 1,
          commitSha: "abc123",
        })
      ).rejects.toThrow("Project not found or unauthorized");
    });
  });

  describe("getById", () => {
    it("returns deployment details if user owns the project", async () => {
      const mockDeployment = {
        id: 1,
        projectId: 1,
        deploymentUrl: "https://deploy-1-abc123.vercel-clone.app",
        branch: "main",
        commitSha: "abc123",
        commitMessage: "Initial commit",
        commitAuthor: "test",
        status: "success" as const,
        buildDuration: 5000,
        startedAt: new Date(),
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getDeploymentById).mockResolvedValue(mockDeployment);
      vi.mocked(db.getProjectById).mockResolvedValue(mockProject);

      const ctx = createAuthContext(1);
      const caller = deploymentsRouter.createCaller(ctx);

      const result = await caller.getById({ deploymentId: 1 });

      expect(result).toEqual(mockDeployment);
    });

    it("throws error if deployment does not exist", async () => {
      vi.mocked(db.getDeploymentById).mockResolvedValue(undefined);

      const ctx = createAuthContext(1);
      const caller = deploymentsRouter.createCaller(ctx);

      await expect(caller.getById({ deploymentId: 999 })).rejects.toThrow(
        "Deployment not found"
      );
    });
  });

  describe("listByProject", () => {
    it("returns deployments for a project owned by the user", async () => {
      const mockDeployments = [
        {
          id: 1,
          projectId: 1,
          deploymentUrl: "https://deploy-1-abc123.vercel-clone.app",
          branch: "main",
          commitSha: "abc123",
          commitMessage: "Initial commit",
          commitAuthor: "test",
          status: "success" as const,
          buildDuration: 5000,
          startedAt: new Date(),
          completedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(db.getProjectById).mockResolvedValue(mockProject);
      vi.mocked(db.getDeploymentsByProjectId).mockResolvedValue(mockDeployments);

      const ctx = createAuthContext(1);
      const caller = deploymentsRouter.createCaller(ctx);

      const result = await caller.listByProject({ projectId: 1 });

      expect(result).toEqual(mockDeployments);
    });

    it("throws error if user does not own the project", async () => {
      const otherUserProject = { ...mockProject, userId: 2 };
      vi.mocked(db.getProjectById).mockResolvedValue(otherUserProject);

      const ctx = createAuthContext(1);
      const caller = deploymentsRouter.createCaller(ctx);

      await expect(caller.listByProject({ projectId: 1 })).rejects.toThrow(
        "Project not found or unauthorized"
      );
    });
  });

  describe("rollback", () => {
    it("creates a new deployment based on a previous one", async () => {
      const mockDeployment = {
        id: 1,
        projectId: 1,
        deploymentUrl: "https://deploy-1-abc123.vercel-clone.app",
        branch: "main",
        commitSha: "abc123",
        commitMessage: "Initial commit",
        commitAuthor: "test",
        status: "success" as const,
        buildDuration: 5000,
        startedAt: new Date(),
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getProjectById).mockResolvedValue(mockProject);
      vi.mocked(db.getDeploymentById).mockResolvedValue(mockDeployment);
      vi.mocked(db.createDeployment).mockResolvedValue({ insertId: 2 } as any);

      const ctx = createAuthContext(1);
      const caller = deploymentsRouter.createCaller(ctx);

      const result = await caller.rollback({
        projectId: 1,
        deploymentId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.deploymentId).toBe(2);
      expect(result.deploymentUrl).toContain("deploy-1-");
    });
  });
});
