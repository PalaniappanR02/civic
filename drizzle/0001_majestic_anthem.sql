CREATE TABLE `analytics_summary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`totalReports` int DEFAULT 0,
	`resolvedReports` int DEFAULT 0,
	`activeReports` int DEFAULT 0,
	`criticalAlerts` int DEFAULT 0,
	`activeUsers` int DEFAULT 0,
	`averageResolutionTime` decimal(10,2),
	`categoryBreakdown` json,
	`priorityBreakdown` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_summary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `civic_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` enum('infrastructure','utilities','environment','safety','sanitation','transport','other') NOT NULL,
	`priority` enum('low','medium','high','critical') NOT NULL,
	`status` enum('open','in-progress','resolved','closed') NOT NULL DEFAULT 'open',
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`ward` varchar(100),
	`votes` int DEFAULT 0,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	CONSTRAINT `civic_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_trends` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`category` varchar(100) NOT NULL,
	`reportCount` int DEFAULT 0,
	`resolvedCount` int DEFAULT 0,
	`averagePriority` decimal(3,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_trends_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hotspots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`ward` varchar(100),
	`intensity` decimal(5,2),
	`reportCount` int DEFAULT 0,
	`category` varchar(100),
	`lastUpdated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hotspots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int,
	`predictionType` enum('resolution_time','hotspot','category_trend','priority_forecast') NOT NULL,
	`category` varchar(100),
	`ward` varchar(100),
	`predictedValue` decimal(10,2),
	`confidence` decimal(5,4),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `predictions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `report_updates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`status` enum('open','in-progress','resolved','closed') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `report_updates_id` PRIMARY KEY(`id`)
);
