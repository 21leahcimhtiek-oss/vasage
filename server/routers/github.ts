import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getGitHubTokenByUserId, saveGitHubToken, createProject } from "../db";

const GITHUB_API_BASE = "https://api.github.com";

/**
 * Exchange GitHub OAuth code for access token
 */
async function exchangeCodeForToken(code: string, clientId: string, clientSecret: string): Promise<string> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const data = await response.json() as { access_token?: string; error?: string };
  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error}`);
  }
  if (!data.access_token) {
    throw new Error("No access token received from GitHub");
  }
  return data.access_token;
}

/**
 * Get user info from GitHub
 */
async function getGitHubUser(accessToken: string) {
  const response = await fetch(`${GITHUB_API_BASE}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user");
  }

  return response.json();
}

/**
 * Get user's repositories from GitHub
 */
async function getGitHubRepositories(accessToken: string, page = 1, perPage = 30) {
  const response = await fetch(
    `${GITHUB_API_BASE}/user/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }

  return response.json();
}

/**
 * Get repository details from GitHub
 */
async function getGitHubRepository(accessToken: string, owner: string, repo: string) {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch repository details");
  }

  return response.json();
}

/**
 * Detect framework from repository
 */
async function detectFramework(accessToken: string, owner: string, repo: string): Promise<string | null> {
  const frameworks: Record<string, string[]> = {
    next: ["next.config.js", "next.config.ts"],
    react: ["react", "react-dom"],
    vue: ["vue.config.js", "vite.config.js"],
    svelte: ["svelte.config.js"],
    astro: ["astro.config.mjs", "astro.config.js"],
    nuxt: ["nuxt.config.ts", "nuxt.config.js"],
  };

  try {
    // Try to fetch package.json
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/package.json`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (response.ok) {
      const packageJson = await response.json() as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      for (const [framework, files] of Object.entries(frameworks)) {
        if (allDeps[framework]) {
          return framework;
        }
      }
    }
  } catch (error) {
    console.error("Error detecting framework:", error);
  }

  return null;
}

/**
 * Get default build commands for a framework
 */
function getBuildCommands(framework: string | null) {
  const commands: Record<string, { build: string; install: string; output: string }> = {
    next: {
      build: "npm run build",
      install: "npm install",
      output: ".next",
    },
    react: {
      build: "npm run build",
      install: "npm install",
      output: "build",
    },
    vue: {
      build: "npm run build",
      install: "npm install",
      output: "dist",
    },
    svelte: {
      build: "npm run build",
      install: "npm install",
      output: "build",
    },
    astro: {
      build: "npm run build",
      install: "npm install",
      output: "dist",
    },
    nuxt: {
      build: "npm run build",
      install: "npm install",
      output: ".output",
    },
  };

  return commands[framework || "react"] || commands.react;
}

export const githubRouter = router({
  /**
   * Get GitHub OAuth URL for user to authorize
   */
  getOAuthUrl: protectedProcedure
    .input(
      z.object({
        clientId: z.string(),
        redirectUri: z.string().url(),
      })
    )
    .query(({ input }) => {
      const scope = "repo,user";
      const url = new URL("https://github.com/login/oauth/authorize");
      url.searchParams.set("client_id", input.clientId);
      url.searchParams.set("redirect_uri", input.redirectUri);
      url.searchParams.set("scope", scope);
      url.searchParams.set("state", Math.random().toString(36).substring(7));
      return url.toString();
    }),

  /**
   * Exchange GitHub OAuth code for access token and save it
   */
  exchangeCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        clientId: z.string(),
        clientSecret: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const accessToken = await exchangeCodeForToken(input.code, input.clientId, input.clientSecret);
      const user = await getGitHubUser(accessToken);

      await saveGitHubToken({
        userId: ctx.user.id,
        accessToken,
        githubUsername: user.login,
      });

      return {
        success: true,
        username: user.login,
      };
    }),

  /**
   * Get list of user's GitHub repositories
   */
  listRepositories: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        perPage: z.number().default(30),
      })
    )
    .query(async ({ input, ctx }) => {
      const token = await getGitHubTokenByUserId(ctx.user.id);
      if (!token?.accessToken) {
        throw new Error("GitHub not connected");
      }

      const repos = await getGitHubRepositories(token.accessToken, input.page, input.perPage);
      return repos;
    }),

  /**
   * Import a GitHub repository as a project
   */
  importRepository: protectedProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        projectName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const token = await getGitHubTokenByUserId(ctx.user.id);
      if (!token?.accessToken) {
        throw new Error("GitHub not connected");
      }

      // Get repository details
      const repoDetails = await getGitHubRepository(token.accessToken, input.owner, input.repo);

      // Detect framework
      const framework = await detectFramework(token.accessToken, input.owner, input.repo);
      const buildCommands = getBuildCommands(framework);

      // Create project
      const result = await createProject({
        userId: ctx.user.id,
        name: input.projectName || input.repo,
        description: repoDetails.description,
        githubRepoUrl: repoDetails.clone_url,
        githubRepoName: input.repo,
        githubOwner: input.owner,
        defaultBranch: repoDetails.default_branch,
        framework: framework || undefined,
        buildCommand: buildCommands.build,
        installCommand: buildCommands.install,
        outputDirectory: buildCommands.output,
      });

      return {
        success: true,
        projectId: (result as any).insertId || 0,
        framework,
      };
    }),
});
