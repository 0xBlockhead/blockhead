import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
	readdir,
	readFile,
	stat,
} from 'node:fs/promises'
import {
	join,
	relative,
} from 'node:path'
import { performance } from 'node:perf_hooks'

const root = process.cwd()
const args = new Set(process.argv.slice(2))
const tsconfig = './tsconfig.svelte-check.json'
const generatedRoot = join(root, '.svelte-kit')
const maxChangedPaths = 30

const commandLine = (command, commandArgs) => [command, ...commandArgs].join(' ')

const run = (label, command, commandArgs) => new Promise((resolve) => {
	const start = performance.now()
	const child = spawn(command, commandArgs, {
		cwd: root,
		stdio: [
			'ignore',
			'pipe',
			'pipe',
		],
		env: {
			...process.env,
			NO_COLOR: '1',
		},
	})
	let stdout = ''
	let stderr = ''
	child.stdout.on('data', (chunk) => {
		stdout += chunk
	})
	child.stderr.on('data', (chunk) => {
		stderr += chunk
	})
	child.on('close', (code) => {
		resolve({
			label,
			command: commandLine(command, commandArgs),
			code,
			durationMs: performance.now() - start,
			stdout,
			stderr,
		})
	})
})

const walkFiles = async (directory) => {
	let entries
	try {
		entries = await readdir(directory, { withFileTypes: true })
	} catch {
		return []
	}
	const files = []
	for (const entry of entries) {
		const path = `${directory}/${entry.name}`
		if (entry.isDirectory()) {
			if (entry.name !== 'node_modules')
				files.push(...await walkFiles(path))
		} else if (entry.isFile()) {
			files.push(path)
		}
	}
	return files
}

const fileFingerprint = async (path) => {
	const [metadata, bytes] = await Promise.all([
		stat(path),
		readFile(path),
	])
	return {
		size: metadata.size,
		mtimeMs: Math.round(metadata.mtimeMs),
		hash: createHash('sha1').update(bytes).digest('hex'),
	}
}

const snapshotGeneratedFiles = async () => {
	const files = await walkFiles(generatedRoot)
	const entries = await Promise.all(files.map(async (path) => [
		relative(root, path),
		await fileFingerprint(path),
	]))
	return new Map(entries)
}

const diffSnapshots = (before, after) => {
	const changed = []
	const allPaths = new Set([
		...before.keys(),
		...after.keys(),
	])
	for (const path of [...allPaths].sort()) {
		const oldValue = before.get(path)
		const newValue = after.get(path)
		if (oldValue == null) {
			changed.push({ path, kind: 'added' })
		} else if (newValue == null) {
			changed.push({ path, kind: 'removed' })
		} else if (
			oldValue.size !== newValue.size
			|| oldValue.hash !== newValue.hash
		) {
			changed.push({ path, kind: 'content' })
		} else if (oldValue.mtimeMs !== newValue.mtimeMs) {
			changed.push({ path, kind: 'mtime' })
		}
	}
	return changed
}

const summarizeOutput = (output) => (
	output
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.filter((line) => (
			line.includes('found ')
			|| line.startsWith('Error:')
			|| line.includes('Error: ')
		))
)

const checkArgs = (extraArgs = []) => [
	'exec',
	'svelte-check',
	'--incremental',
	'--tsconfig',
	tsconfig,
	...extraArgs,
]

const scenarios = [
	{
		label: 'svelte-kit sync',
		command: 'pnpm',
		args: [
			'exec',
			'svelte-kit',
			'sync',
		],
	},
	{
		label: 'full check 1',
		command: 'pnpm',
		args: checkArgs(),
	},
	{
		label: 'full check 2',
		command: 'pnpm',
		args: checkArgs(),
	},
	{
		label: 'js diagnostics',
		command: 'pnpm',
		args: checkArgs([
			'--diagnostic-sources',
			'js',
		]),
	},
	{
		label: 'svelte+css diagnostics',
		command: 'pnpm',
		args: checkArgs([
			'--diagnostic-sources',
			'svelte,css',
		]),
	},
	{
		label: 'svelte diagnostics',
		command: 'pnpm',
		args: checkArgs([
			'--diagnostic-sources',
			'svelte',
		]),
	},
	{
		label: 'css diagnostics',
		command: 'pnpm',
		args: checkArgs([
			'--diagnostic-sources',
			'css',
		]),
	},
]

const selectedScenarios = args.has('--full') ?
	scenarios
:
	scenarios.slice(0, 5)

let previousSnapshot = await snapshotGeneratedFiles()
const results = []

for (const scenario of selectedScenarios) {
	const result = await run(scenario.label, scenario.command, scenario.args)
	const nextSnapshot = await snapshotGeneratedFiles()
	const changedGeneratedFiles = diffSnapshots(previousSnapshot, nextSnapshot)
	previousSnapshot = nextSnapshot
	results.push({
		...result,
		changedGeneratedFiles,
	})
	process.stdout.write(`${scenario.label}: ${(result.durationMs / 1000).toFixed(2)}s, exit ${result.code}, generated changes ${changedGeneratedFiles.length}\n`)
}

process.stdout.write('\n')
for (const result of results) {
	process.stdout.write(`## ${result.label}\n`)
	process.stdout.write(`command: ${result.command}\n`)
	process.stdout.write(`duration: ${(result.durationMs / 1000).toFixed(2)}s\n`)
	process.stdout.write(`exit: ${result.code}\n`)
	const summary = [
		...summarizeOutput(result.stdout),
		...summarizeOutput(result.stderr),
	]
	if (summary.length) {
		process.stdout.write('diagnostics:\n')
		for (const line of summary)
			process.stdout.write(`  ${line}\n`)
	}
	if (result.changedGeneratedFiles.length) {
		process.stdout.write(`generated changes (${result.changedGeneratedFiles.length}):\n`)
		for (const change of result.changedGeneratedFiles.slice(0, maxChangedPaths))
			process.stdout.write(`  ${change.kind} ${change.path}\n`)
		if (result.changedGeneratedFiles.length > maxChangedPaths)
			process.stdout.write(`  ... ${result.changedGeneratedFiles.length - maxChangedPaths} more\n`)
	}
	process.stdout.write('\n')
}

const failed = results.find((result) => result.code !== 0)
if (failed)
	process.exitCode = failed.code ?? 1
