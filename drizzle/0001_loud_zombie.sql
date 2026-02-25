CREATE TABLE `buildLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deploymentId` int NOT NULL,
	`message` text NOT NULL,
	`level` enum('info','warning','error','success') NOT NULL DEFAULT 'info',
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `buildLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customDomains` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`domain` varchar(255) NOT NULL,
	`deploymentId` int,
	`isVerified` int NOT NULL DEFAULT 0,
	`verificationToken` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customDomains_id` PRIMARY KEY(`id`),
	CONSTRAINT `customDomains_domain_unique` UNIQUE(`domain`)
);
--> statement-breakpoint
CREATE TABLE `deployments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`deploymentUrl` varchar(512) NOT NULL,
	`branch` varchar(255) NOT NULL,
	`commitSha` varchar(255) NOT NULL,
	`commitMessage` text,
	`commitAuthor` varchar(255),
	`status` enum('pending','building','success','failed','cancelled') NOT NULL DEFAULT 'pending',
	`buildDuration` int,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deployments_id` PRIMARY KEY(`id`),
	CONSTRAINT `deployments_deploymentUrl_unique` UNIQUE(`deploymentUrl`)
);
--> statement-breakpoint
CREATE TABLE `environmentVariables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`environment` enum('preview','production','all') NOT NULL DEFAULT 'all',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `environmentVariables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `githubTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text,
	`expiresAt` timestamp,
	`githubUsername` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `githubTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `githubTokens_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`githubRepoUrl` varchar(512) NOT NULL,
	`githubRepoName` varchar(255) NOT NULL,
	`githubOwner` varchar(255) NOT NULL,
	`defaultBranch` varchar(255) NOT NULL DEFAULT 'main',
	`framework` varchar(100),
	`buildCommand` text,
	`installCommand` text,
	`outputDirectory` varchar(255),
	`rootDirectory` varchar(255) NOT NULL DEFAULT '.',
	`isPublic` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `buildLogs` ADD CONSTRAINT `buildLogs_deploymentId_deployments_id_fk` FOREIGN KEY (`deploymentId`) REFERENCES `deployments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customDomains` ADD CONSTRAINT `customDomains_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customDomains` ADD CONSTRAINT `customDomains_deploymentId_deployments_id_fk` FOREIGN KEY (`deploymentId`) REFERENCES `deployments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deployments` ADD CONSTRAINT `deployments_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `environmentVariables` ADD CONSTRAINT `environmentVariables_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `githubTokens` ADD CONSTRAINT `githubTokens_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;