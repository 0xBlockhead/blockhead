import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

import {
	partitionTypeScriptRoots,
	readCanonicalFileManifest,
	runShardQueue,
	writeShardConfigs,
} from './svelte-check.mjs'


const positiveInteger = (value, fallback) => {
	const parsed = Number(value)
	return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export const runE2eTypeCheck = async ({
	projectRoot = process.cwd(),
	tsconfigPath = path.resolve(projectRoot, 'tsconfig.e2e.json'),
	tscCommand = path.resolve(projectRoot, 'node_modules/@typescript/native/bin/tsc'),
	shardCount = positiveInteger(process.env.E2E_CHECK_SHARD_COUNT, 64),
	concurrency = positiveInteger(
		process.env.E2E_CHECK_CONCURRENCY,
		Math.max(1, Math.min(4, Math.floor(os.availableParallelism() / 2)))
	),
	shardTimeoutMs = positiveInteger(process.env.E2E_CHECK_SHARD_TIMEOUT_MS, 900_000),
	globalTimeoutMs = positiveInteger(process.env.E2E_CHECK_GLOBAL_TIMEOUT_MS, 3_600_000),
	environment = process.env,
} = {}) => {
	const manifest = readCanonicalFileManifest(projectRoot, tsconfigPath)
	const shards = await writeShardConfigs(
		tsconfigPath,
		path.resolve(projectRoot, '.svelte-kit/e2e-typescript-shards'),
		await partitionTypeScriptRoots(manifest.typeScriptRoots, shardCount),
		manifest.ambientDeclarationFiles
	)
	process.stdout.write(`E2E roots: ${manifest.typeScriptRoots.length}; shards: ${shards.length}; concurrency: ${concurrency}\n`)
	const results = await runShardQueue({
		shards,
		command: tscCommand,
		projectRoot,
		concurrency,
		shardTimeoutMs,
		deadline: Date.now() + globalTimeoutMs,
		environment,
		stopOnFailure: false,
		argsForShard: (shard) => [
			'--project',
			shard.configPath,
			'--noEmit',
			'--pretty',
			'false',
			'--incremental',
			'false',
		],
	})
	for (const result of results) {
		const state = result.timedOut ? 'TIMEOUT' : result.code === 0 ? 'PASS' : 'FAIL'
		process.stdout.write(`${result.label}: ${state} (${result.roots.length} roots)\n`)
		if (result.code !== 0 || result.timedOut) {
			const diagnosticsPath = `${result.configPath}.log`
			await fs.writeFile(diagnosticsPath, result.output)
			process.stdout.write(`  manifest: ${result.configPath}\n`)
			process.stdout.write(`  diagnostics: ${diagnosticsPath}\n`)
		}
	}

	return results.every((result) => result.code === 0 && !result.timedOut) ? 0 : 1
}

if (path.resolve(process.argv[1]) === path.resolve(import.meta.filename))
	process.exitCode = await runE2eTypeCheck()
