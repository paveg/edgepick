CREATE TABLE `brands` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`country` text,
	`logo_url` text,
	`website_url` text,
	`description` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brands_slug_unique` ON `brands` (`slug`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`sport` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_sport_slug_unique` ON `categories` (`sport`,`slug`);--> statement-breakpoint
CREATE TABLE `model_images` (
	`id` text PRIMARY KEY NOT NULL,
	`model_id` text NOT NULL,
	`url` text NOT NULL,
	`alt_text` text,
	`image_type` text DEFAULT 'product' NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`model_id`) REFERENCES `models`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `model_sizes` (
	`id` text PRIMARY KEY NOT NULL,
	`model_id` text NOT NULL,
	`length_cm` real NOT NULL,
	`waist_width_mm` real,
	`nose_width_mm` real,
	`tail_width_mm` real,
	`sidecut_radius_m` real,
	`effective_edge_mm` real,
	`weight_g` integer,
	`rider_weight_min_kg` integer,
	`rider_weight_max_kg` integer,
	`display_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`model_id`) REFERENCES `models`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `model_sizes_model_id_length_cm_unique` ON `model_sizes` (`model_id`,`length_cm`);--> statement-breakpoint
CREATE TABLE `models` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`sport` text NOT NULL,
	`level` text NOT NULL,
	`season` text NOT NULL,
	`msrp_jpy` integer,
	`description` text,
	`is_published` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `models_brand_id_slug_season_unique` ON `models` (`brand_id`,`slug`,`season`);--> statement-breakpoint
CREATE TABLE `ski_specs` (
	`id` text PRIMARY KEY NOT NULL,
	`model_id` text NOT NULL,
	`rocker_type` text,
	`tail_type` text,
	`core_material` text,
	`base_material` text,
	`sidewall` text,
	`mount_point_cm` real,
	FOREIGN KEY (`model_id`) REFERENCES `models`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ski_specs_model_id_unique` ON `ski_specs` (`model_id`);--> statement-breakpoint
CREATE TABLE `snowboard_specs` (
	`id` text PRIMARY KEY NOT NULL,
	`model_id` text NOT NULL,
	`shape` text,
	`bend_profile` text,
	`flex_rating` integer,
	`base_material` text,
	`core_material` text,
	`mounting` text,
	`setback_mm` real,
	FOREIGN KEY (`model_id`) REFERENCES `models`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `snowboard_specs_model_id_unique` ON `snowboard_specs` (`model_id`);