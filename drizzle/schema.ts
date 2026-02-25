import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table - stores user projects connected to GitHub repositories
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  githubRepoUrl: varchar("githubRepoUrl", { length: 512 }).notNull(),
  githubRepoName: varchar("githubRepoName", { length: 255 }).notNull(),
  githubOwner: varchar("githubOwner", { length: 255 }).notNull(),
  defaultBranch: varchar("defaultBranch", { length: 255 }).default("main").notNull(),
  framework: varchar("framework", { length: 100 }), // next, react, vue, svelte, etc.
  buildCommand: text("buildCommand"),
  installCommand: text("installCommand"),
  outputDirectory: varchar("outputDirectory", { length: 255 }),
  rootDirectory: varchar("rootDirectory", { length: 255 }).default(".").notNull(),
  isPublic: int("isPublic").default(1).notNull(), // 1 = true, 0 = false
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Deployments table - stores deployment records for each project
 */
export const deployments = mysqlTable("deployments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id),
  deploymentUrl: varchar("deploymentUrl", { length: 512 }).notNull().unique(),
  branch: varchar("branch", { length: 255 }).notNull(),
  commitSha: varchar("commitSha", { length: 255 }).notNull(),
  commitMessage: text("commitMessage"),
  commitAuthor: varchar("commitAuthor", { length: 255 }),
  status: mysqlEnum("status", ["pending", "building", "success", "failed", "cancelled"]).default("pending").notNull(),
  buildDuration: int("buildDuration"), // in milliseconds
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Deployment = typeof deployments.$inferSelect;
export type InsertDeployment = typeof deployments.$inferInsert;

/**
 * Build logs table - stores real-time build logs for deployments
 */
export const buildLogs = mysqlTable("buildLogs", {
  id: int("id").autoincrement().primaryKey(),
  deploymentId: int("deploymentId").notNull().references(() => deployments.id),
  message: text("message").notNull(),
  level: mysqlEnum("level", ["info", "warning", "error", "success"]).default("info").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type BuildLog = typeof buildLogs.$inferSelect;
export type InsertBuildLog = typeof buildLogs.$inferInsert;

/**
 * Environment variables table - stores project environment variables
 */
export const environmentVariables = mysqlTable("environmentVariables", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value").notNull(),
  environment: mysqlEnum("environment", ["preview", "production", "all"]).default("all").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EnvironmentVariable = typeof environmentVariables.$inferSelect;
export type InsertEnvironmentVariable = typeof environmentVariables.$inferInsert;

/**
 * Custom domains table - stores custom domain mappings
 */
export const customDomains = mysqlTable("customDomains", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id),
  domain: varchar("domain", { length: 255 }).notNull().unique(),
  deploymentId: int("deploymentId").references(() => deployments.id),
  isVerified: int("isVerified").default(0).notNull(), // 1 = true, 0 = false
  verificationToken: varchar("verificationToken", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomDomain = typeof customDomains.$inferSelect;
export type InsertCustomDomain = typeof customDomains.$inferInsert;

/**
 * GitHub tokens table - stores encrypted GitHub OAuth tokens per user
 */
export const githubTokens = mysqlTable("githubTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id).unique(),
  accessToken: text("accessToken").notNull(), // Should be encrypted
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  githubUsername: varchar("githubUsername", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GitHubToken = typeof githubTokens.$inferSelect;
export type InsertGitHubToken = typeof githubTokens.$inferInsert;