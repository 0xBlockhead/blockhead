import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { parse } from 'svelte/compiler'
import tsConfig from 'typescript'


export const fatalCompilerWarnings = 'await_reactivity_loss:error,derived_inert:error,state_referenced_locally:error'

const positiveInteger = (value, fallback) => {
	const parsed = Number(value)
	return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const terminateProcessGroup = (child) => {
	if (child.exitCode != null || child.signalCode != null)
		return

	try {
		process.kill(-child.pid, 'SIGTERM')
	} catch (error) {
		if (error.code !== 'ESRCH')
			throw error
	}

	setTimeout(() => {
		if (child.exitCode != null || child.signalCode != null)
			return

		try {
			process.kill(-child.pid, 'SIGKILL')
		} catch (error) {
			if (error.code !== 'ESRCH')
				throw error
		}
	}, 1_000).unref()
}

export const runProcess = ({
	command,
	args,
	cwd,
	timeoutMs,
	label,
	environment = process.env,
	heartbeatMs = 30_000,
}) => new Promise((resolve) => {
	const startedAt = Date.now()
	process.stderr.write(`${label}: START\n`)
	const child = spawn(command, args, {
		cwd,
		detached: true,
		env: environment,
		stdio: [
			'ignore',
			'pipe',
			'pipe',
		],
	})
	let output = ''
	let timedOut = false
	const timer = setTimeout(() => {
		timedOut = true
		terminateProcessGroup(child)
	}, timeoutMs)
	const heartbeat = setInterval(() => {
		process.stderr.write(`${label}: RUNNING (${Math.round((Date.now() - startedAt) / 1_000)}s)\n`)
	}, heartbeatMs)
	heartbeat.unref()

	child.stdout.on('data', (chunk) => {
		output += chunk
	})
	child.stderr.on('data', (chunk) => {
		output += chunk
	})
	child.on('error', (error) => {
		output += `${error.stack ?? error.message}\n`
	})
	child.on('close', (code, signal) => {
		clearTimeout(timer)
		clearInterval(heartbeat)
		process.stderr.write(
			`${label}: ${timedOut ? 'TIMEOUT' : code === 0 ? 'PASS' : 'FAIL'} (${Math.round((Date.now() - startedAt) / 1_000)}s)\n`
		)
		resolve({
			label,
			code: code ?? 1,
			signal,
			timedOut,
			output,
		})
	})
})

export const readCanonicalFileManifest = (projectRoot, tsconfigPath) => {
	const diagnosticHost = {
		getCanonicalFileName: (fileName) => fileName,
		getCurrentDirectory: () => projectRoot,
		getNewLine: () => '\n',
	}
	const configFile = tsConfig.readConfigFile(tsconfigPath, tsConfig.sys.readFile)
	if (configFile.error != null)
		throw new Error(tsConfig.formatDiagnostic(configFile.error, diagnosticHost))

	const parsed = tsConfig.parseJsonConfigFileContent(
		configFile.config,
		tsConfig.sys,
		path.dirname(tsconfigPath),
		undefined,
		tsconfigPath,
		undefined,
		[{
			extension: '.svelte',
			isMixedContent: true,
			scriptKind: tsConfig.ScriptKind.Deferred,
		}]
	)
	if (parsed.errors.length > 0)
		throw new Error(tsConfig.formatDiagnostics(parsed.errors, diagnosticHost))

	const canonicalFiles = [...new Set(parsed.fileNames.map((fileName) => path.resolve(fileName)))].sort()
	const declarationFiles = canonicalFiles.filter((fileName) => fileName.endsWith('.d.ts'))
	return {
		declarationFiles,
		ambientDeclarationFiles: declarationFiles.filter(
			(fileName) => !fileName.includes(`${path.sep}.svelte-kit${path.sep}types${path.sep}`)
		),
		svelteRoots: canonicalFiles.filter((fileName) => fileName.endsWith('.svelte')),
		typeScriptRoots: canonicalFiles.filter((fileName) => (
			!fileName.endsWith('.d.ts')
			&& (
				fileName.endsWith('.js')
				|| fileName.endsWith('.ts')
			)
		)),
	}
}

const typeScriptImports = (source) => tsConfig.preProcessFile(source).importedFiles

export const readCanonicalSvelteRoots = (projectRoot, tsconfigPath) => (
	readCanonicalFileManifest(projectRoot, tsconfigPath).svelteRoots
)

const svelteScriptSources = (source) => {
	const ast = parse(source, { modern: true })
	return [
		ast.module,
		ast.instance,
	]
		.filter((script) => script != null)
		.map((script) => source.slice(script.content.start, script.content.end))
}

const resolveSvelteImport = (projectRoot, importerPath, specifier) => {
	if (!specifier.endsWith('.svelte'))
		return undefined
	if (specifier.startsWith('$/'))
		return path.resolve(projectRoot, 'src', specifier.slice(2))
	if (specifier.startsWith('.'))
		return path.resolve(path.dirname(importerPath), specifier)
	return undefined
}

export const readSvelteGraph = async (projectRoot, roots) => {
	const rootSet = new Set(roots)
	const entries = await Promise.all(roots.map(async (filePath) => {
		const source = await fs.readFile(filePath, 'utf8')
		const imports = new Set()
		let scriptSources
		try {
			scriptSources = svelteScriptSources(source)
		} catch (error) {
			throw new Error(`Failed to parse canonical Svelte root ${filePath}`, {
				cause: error,
			})
		}
		for (const scriptSource of scriptSources) {
			for (const importedFile of typeScriptImports(scriptSource)) {
				const resolved = resolveSvelteImport(projectRoot, filePath, importedFile.fileName)
				if (resolved != null && rootSet.has(resolved))
					imports.add(resolved)
			}
		}

		return [
			filePath,
			{
				bytes: Buffer.byteLength(source),
				imports: [...imports].sort(),
			},
		]
	}))

	return new Map(entries)
}

export const readTypeScriptRootsReachedFromSvelte = async (projectRoot, manifest) => {
	const canonicalFiles = new Set([
		...manifest.svelteRoots,
		...manifest.typeScriptRoots,
	])
	const reachedTypeScriptRoots = new Set()
	const visited = new Set()
	const pending = [...manifest.svelteRoots]
	const importsByFile = new Map(await Promise.all([...canonicalFiles].map(async (filePath) => {
		const source = await fs.readFile(filePath, 'utf8')
		return [
			filePath,
			(
				filePath.endsWith('.svelte') ?
					svelteScriptSources(source)
				:
					[source]
			).flatMap(typeScriptImports),
		]
	})))

	while (pending.length > 0) {
		const importerPath = pending.pop()
		if (importerPath == null || visited.has(importerPath))
			continue
		visited.add(importerPath)

		for (const importedFile of importsByFile.get(importerPath) ?? []) {
			const unresolvedPath = importedFile.fileName.startsWith('$/') ?
				path.resolve(projectRoot, 'src', importedFile.fileName.slice(2))
				: importedFile.fileName.startsWith('.') ?
					path.resolve(path.dirname(importerPath), importedFile.fileName)
					: undefined
			if (unresolvedPath == null)
				continue

			const canonicalPath = [
				unresolvedPath,
				...(unresolvedPath.endsWith('.js') ?
					[`${unresolvedPath.slice(0, -3)}.ts`]
					: []),
				`${unresolvedPath}.ts`,
				`${unresolvedPath}.js`,
				`${unresolvedPath}.svelte`,
				path.join(unresolvedPath, 'index.ts'),
				path.join(unresolvedPath, 'index.js'),
			].find((candidate) => canonicalFiles.has(candidate))
			if (canonicalPath == null)
				continue
			if (visited.has(canonicalPath))
				continue
			if (!canonicalPath.endsWith('.svelte'))
				reachedTypeScriptRoots.add(canonicalPath)
			pending.push(canonicalPath)
		}
	}

	return reachedTypeScriptRoots
}

const transitiveClosure = (root, graph) => {
	const closure = new Set()
	const pending = [root]
	while (pending.length > 0) {
		const filePath = pending.pop()
		if (filePath == null || closure.has(filePath))
			continue
		closure.add(filePath)
		for (const importedPath of graph.get(filePath)?.imports ?? [])
			pending.push(importedPath)
	}
	return closure
}

export const partitionSvelteRoots = (roots, graph, requestedShardCount) => {
	const shardCount = Math.min(requestedShardCount, roots.length)
	if (shardCount === 0)
		throw new Error('canonical Svelte root manifest is empty')

	const closures = new Map(roots.map((root) => [root, transitiveClosure(root, graph)]))
	const maximumRootsPerShard = Math.ceil(roots.length / shardCount * 1.5)
	const closureWeight = (closure) => [...closure].reduce(
		(total, filePath) => total + (graph.get(filePath)?.bytes ?? 0),
		0
	)
	const shards = Array.from({ length: shardCount }, (_, index) => ({
		id: `shard-${String(index + 1).padStart(2, '0')}`,
		roots: [],
		closure: new Set(),
		weight: 0,
	}))
	const orderedRoots = [...roots].sort((left, right) => (
		closureWeight(closures.get(right)) - closureWeight(closures.get(left))
		|| left.localeCompare(right)
	))

	for (const root of orderedRoots) {
		const closure = closures.get(root)
		const shard = shards
			.filter((candidate) => candidate.roots.length < maximumRootsPerShard)
			.map((candidate) => ({
				candidate,
				projectedWeight: closureWeight(new Set([
					...candidate.closure,
					...closure,
				])),
			}))
			.sort((left, right) => (
				left.projectedWeight - right.projectedWeight
				|| left.candidate.roots.length - right.candidate.roots.length
				|| left.candidate.id.localeCompare(right.candidate.id)
			))[0].candidate
		shard.roots.push(root)
		for (const filePath of closure)
			shard.closure.add(filePath)
		shard.weight = closureWeight(shard.closure)
	}

	for (const shard of shards)
		shard.roots.sort()

	const assignedRoots = shards.flatMap((shard) => shard.roots)
	if (
		assignedRoots.length !== roots.length
		|| new Set(assignedRoots).size !== roots.length
		|| roots.some((root) => !assignedRoots.includes(root))
	)
		throw new Error('Svelte shard partition is not an exhaustive one-to-one root assignment')

	return shards.filter((shard) => shard.roots.length > 0).map(({
		closure: _closure,
		...shard
	}) => shard)
}

export const partitionTypeScriptRoots = async (roots, requestedShardCount) => {
	const shardCount = Math.min(requestedShardCount, roots.length)
	if (shardCount === 0)
		return []

	const bytesByRoot = new Map(await Promise.all(roots.map(async (filePath) => [
		filePath,
		(await fs.stat(filePath)).size,
	])))
	const shards = Array.from({ length: shardCount }, (_, index) => ({
		id: `typescript-${String(index + 1).padStart(2, '0')}`,
		roots: [],
		weight: 0,
	}))
	for (const root of [...roots].sort((left, right) => (
		bytesByRoot.get(right) - bytesByRoot.get(left)
		|| left.localeCompare(right)
	))) {
		const shard = [...shards].sort((left, right) => (
			left.weight - right.weight
			|| left.roots.length - right.roots.length
			|| left.id.localeCompare(right.id)
		))[0]
		shard.roots.push(root)
		shard.weight += bytesByRoot.get(root)
	}

	for (const shard of shards)
		shard.roots.sort()

	const assignedRoots = shards.flatMap((shard) => shard.roots)
	if (
		assignedRoots.length !== roots.length
		|| new Set(assignedRoots).size !== roots.length
		|| roots.some((root) => !assignedRoots.includes(root))
	)
		throw new Error('TypeScript shard partition is not an exhaustive one-to-one root assignment')

	return shards.sort((left, right) => left.id.localeCompare(right.id))
}

export const writeShardConfigs = async (
	tsconfigPath,
	shardDirectory,
	shards,
	declarationFiles = []
) => {
	await fs.rm(shardDirectory, {
		force: true,
		recursive: true,
	})
	await fs.mkdir(shardDirectory, { recursive: true })

	return Promise.all(shards.map(async (shard) => {
		const configPath = path.join(shardDirectory, `${shard.id}.json`)
		await fs.writeFile(configPath, `${JSON.stringify({
			extends: path.resolve(tsconfigPath),
			...(declarationFiles.length > 0 && {
				files: declarationFiles,
			}),
			include: shard.roots,
		}, null, '\t')}\n`)
		return {
			...shard,
			configPath,
		}
	}))
}

export const svelteCheckArgs = (projectRoot, configPath) => [
	'--workspace',
	projectRoot,
	'--tsconfig',
	configPath,
	'--tsgo',
	'--output',
	'machine',
	'--compiler-warnings',
	fatalCompilerWarnings,
]

export const runShardQueue = async ({
	shards,
	command,
	projectRoot,
	concurrency,
	shardTimeoutMs,
	deadline,
	environment,
	stopOnFailure = true,
	argsForShard = (shard) => svelteCheckArgs(projectRoot, shard.configPath),
}) => {
	let nextIndex = 0
	let failed = false
	const results = []
	const worker = async () => {
		while ((!stopOnFailure || !failed) && nextIndex < shards.length) {
			const shard = shards[nextIndex]
			nextIndex += 1
			const remainingMs = deadline - Date.now()
			if (remainingMs <= 0) {
				results.push({
					label: shard.id,
					code: 1,
					timedOut: true,
					output: 'global Svelte-check deadline expired before shard start\n',
					roots: shard.roots,
					configPath: shard.configPath,
				})
				continue
			}

			const result = {
				...await runProcess({
					command,
					args: argsForShard(shard),
					cwd: projectRoot,
					timeoutMs: Math.min(shardTimeoutMs, remainingMs),
					label: shard.id,
					environment,
				}),
				roots: shard.roots,
				configPath: shard.configPath,
			}
			results.push(result)
			if (stopOnFailure && (result.code !== 0 || result.timedOut))
				failed = true
		}
	}

	await Promise.all(Array.from(
		{ length: Math.min(concurrency, shards.length) },
		worker
	))
	return results.sort((left, right) => left.label.localeCompare(right.label))
}

const printResult = (result) => {
	const state = result.timedOut ? 'TIMEOUT' : result.code === 0 ? 'PASS' : 'FAIL'
	process.stdout.write(`${result.label}: ${state}\n`)
	if (result.roots != null) {
		process.stdout.write(`  roots: ${result.roots.length}\n`)
		if (result.code !== 0 || result.timedOut)
			process.stdout.write(`  manifest: ${result.configPath}\n`)
	}
	if (result.output !== '')
		process.stdout.write(result.output.endsWith('\n') ? result.output : `${result.output}\n`)
}

export const runCanonicalSvelteCheck = async ({
	projectRoot = process.cwd(),
	tsconfigPath = path.resolve(projectRoot, 'tsconfig.svelte-check.json'),
	tscCommand = process.env.SVELTE_CHECK_TSC_COMMAND ?? path.resolve(projectRoot, 'node_modules/.bin/tsc'),
	svelteCheckCommand = process.env.SVELTE_CHECK_COMMAND ?? path.resolve(projectRoot, 'node_modules/.bin/svelte-check'),
	typeScriptShardCount = positiveInteger(process.env.SVELTE_CHECK_TYPESCRIPT_SHARD_COUNT, 64),
	concurrency = positiveInteger(
		process.env.SVELTE_CHECK_CONCURRENCY,
		Math.max(1, Math.floor(os.availableParallelism() / 2))
	),
	shardTimeoutMs = positiveInteger(process.env.SVELTE_CHECK_SHARD_TIMEOUT_MS, 3_600_000),
	globalTimeoutMs = positiveInteger(process.env.SVELTE_CHECK_GLOBAL_TIMEOUT_MS, 4_500_000),
	environment = process.env,
} = {}) => {
	const deadline = Date.now() + globalTimeoutMs
	const manifest = readCanonicalFileManifest(projectRoot, tsconfigPath)
	const reachedTypeScriptRoots = await readTypeScriptRootsReachedFromSvelte(
		projectRoot,
		manifest
	)
	const plainTypeScriptRoots = manifest.typeScriptRoots.filter(
		(filePath) => !reachedTypeScriptRoots.has(filePath)
	)
	const typeScriptShards = await writeShardConfigs(
		tsconfigPath,
		path.resolve(projectRoot, '.svelte-kit/svelte-check-typescript-shards'),
		await partitionTypeScriptRoots(plainTypeScriptRoots, typeScriptShardCount),
		manifest.ambientDeclarationFiles
	)
	process.stdout.write(`TypeScript roots: ${manifest.typeScriptRoots.length}; covered through Svelte: ${reachedTypeScriptRoots.size}; plain TypeScript roots: ${plainTypeScriptRoots.length}; shards: ${typeScriptShards.length}; concurrency: ${concurrency}\n`)
	const typeScriptResults = await runShardQueue({
		shards: typeScriptShards,
		command: tscCommand,
		projectRoot,
		concurrency,
		shardTimeoutMs,
		deadline,
		environment,
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
	for (const result of typeScriptResults)
		printResult(result)
	if (typeScriptResults.some((result) => result.code !== 0 || result.timedOut))
		return 1

	const { svelteRoots: roots } = manifest
	const shards = [{
		id: 'svelte-check',
		roots,
		configPath: tsconfigPath,
	}]
	process.stdout.write(`Svelte roots: ${roots.length}; checker: upstream native TypeScript\n`)
	const results = await runShardQueue({
		shards,
		command: svelteCheckCommand,
		projectRoot,
		concurrency: 1,
		shardTimeoutMs,
		deadline,
		environment: {
			...environment,
			NODE_OPTIONS: (
				environment.NODE_OPTIONS?.includes('--max-old-space-size') ?
					environment.NODE_OPTIONS
				:
					[
						environment.NODE_OPTIONS,
						'--max-old-space-size=8192',
					].filter(Boolean).join(' ')
			),
		},
	})
	for (const result of results)
		printResult(result)

	return results.every((result) => result.code === 0) ? 0 : 1
}

const isMain = process.argv.length > 1
	&& path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain)
	process.exitCode = await runCanonicalSvelteCheck()
