import { config } from "./config";
import { syncUserDiscordWidget } from "./services/discord.service";
import { fetchProfileStatistics } from "./services/roblox.service";
import type { NormalizedRobloxStats } from "./types/roblox";

async function initialize(): Promise<void> {
	console.log(
		`[INFO] [${new Date().toISOString()}] Starting sync worker. Interval: ${config.syncIntervalMs}ms.`,
	);

	let running = false;
	let lastState: NormalizedRobloxStats | null = null;

	try {
		const statistics = await fetchProfileStatistics();
		await syncUserDiscordWidget(config.discordUserId, statistics);
		lastState = statistics;

		console.log(`[INFO] [${new Date().toISOString()}] Initial sync completed.`);
	} catch (error) {
		console.error(
			`[ERROR] [${new Date().toISOString()}] Failed to complete initial sync: ${error}`,
		);
	}

	setInterval(async () => {
		if (running) return;
		running = true;

		try {
			const statistics = await fetchProfileStatistics();

			// compare with last state and update if necessary

			const changed =
				!lastState || JSON.stringify(lastState) !== JSON.stringify(statistics);

			if (changed) {
				await syncUserDiscordWidget(config.discordUserId, statistics);

				lastState = statistics;

				console.log(
					`[INFO] [${new Date().toISOString()}] Synchronized user data with Discord widget.`,
				);
			} else {
				console.log(
					`[INFO] [${new Date().toISOString()}] No changes detected. Skipping synchronization.`,
				);
			}
		} catch (error) {
			console.error(
				`[ERROR] [${new Date().toISOString()}] Failed to synchronize user data: ${error}`,
			);
		} finally {
			running = false;
		}
	}, config.syncIntervalMs);
}

// System daemon entry point
initialize();
