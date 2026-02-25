import { describe, expect, it, beforeEach, vi } from "vitest";
import { projectsRouter } from "./projects";
import type { TrpcContext } from "../_core/context";

// Mock database functions
vi.mock("../db", () => ({
  getProjectsByUserId: vi.fn(),
  getProjectById: vi.fn(),
  createProject: vi.fn(),
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

describe("projectsRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("list", () => {
    it("returns projects for the current user", async () => {
      const mockProjects = [
        {
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
        },
      ];

      vi.mocked(db.getProjectsByUserId).mockResolvedValue(mockProjects);

      const ctx = createAuthContext(1);
      const caller = projectsRouter.createCaller(ctx);

      const result = await caller.list();

      expect(result).toEqual(mockProjects);
      expect(db.getProjectsByUserId).toHaveBeenCalledWith(1);
    });

    it("returns empty array if user has no projects", async () => {
      vi.mocked(db.getProjectsByUserId).mockResolvedValue([]);

      const ctx = createAuthContext(1);
      const caller = projectsRouter.createCaller(ctx);

      const result = await caller.list();

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("returns a project if user owns it", async () => {
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

      vi.mocked(db.getProjectById).mockResolvedValue(mockProject);

      const ctx = createAuthContext(1);
      const caller = projectsRouter.createCaller(ctx);

      const result = await caller.getById({ projectId: 1 });

      expect(result).toEqual(mockProject);
    });

    it("throws error if user does not own the project", async () => {
      const mockProject = {
        id: 1,
        userId: 2, // Different user
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

      vi.mocked(db.getProjectById).mockResolvedValue(mockProject);

      const ctx = createAuthContext(1);
      const caller = projectsRouter.createCaller(ctx);

      await expect(caller.getById({ projectId: 1 })).rejects.toThrow(
        "Project not found or unauthorized"
      );
    });
  });

  describe("create", () => {
    it("creates a new project for the user", async () => {
      vi.mocked(db.createProject).mockResolvedValue({ insertId: 1 } as any);

      const ctx = createAuthContext(1);
      const caller = projectsRouter.createCaller(ctx);

      const result = await caller.create({
        name: "New Project",
        githubRepoUrl: "https://github.com/test/repo",
        githubRepoName: "repo",
        githubOwner: "test",
      });

      expect(result).toBeDefined();
      expect(db.createProject).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          name: "New Project",
          githubRepoUrl: "https://github.com/test/repo",
        })
      );
    });
  });

  describe("getDeployments", () => {
    it("returns deployments for a project owned by the user", async () => {
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

      const mockDeployments = [
        {
          id: 1,
          projectId: 1,
          deploymentUrl: "https://deployment-123.vercel-clone.app",
          branch: "main",
          commitSha: "abc123",
          commitMessage: "Initial commit",
          commitAuthor: "test",
          status: "success",
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
      const caller = projectsRouter.createCaller(ctx);

      const result = await caller.getDeployments({ projectId: 1 });

      expect(result).toEqual(mockDeployments);
    });

    it("throws error if user does not own the project", async () => {
      const mockProject = {
        id: 1,
        userId: 2, // Different user
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

      vi.mocked(db.getProjectById).mockResolvedValue(mockProject);

      const ctx = createAuthContext(1);
      const caller = projectsRouter.createCaller(ctx);

      await expect(caller.getDeployments({ projectId: 1 })).rejects.toThrow(
        "Project not found or unauthorized"
      );
    });
  });
});
