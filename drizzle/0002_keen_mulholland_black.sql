CREATE TABLE `report_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportId` int NOT NULL,
	`photoUrl` text NOT NULL,
	`caption` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `report_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `street_lights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`status` enum('on','off','faulty') NOT NULL DEFAULT 'on',
	`ward` varchar(100),
	`lastChecked` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `street_lights_id` PRIMARY KEY(`id`)
);
