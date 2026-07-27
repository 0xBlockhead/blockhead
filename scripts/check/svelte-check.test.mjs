import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
	fatalCompilerWarnings,
	partitionSvelteRoots,
	readCanonicalFileManifest,
	readCanonicalSvelteRoots,
	readSvelteGraph,
	runProcess,
	runShardQueue,
	svelteCheckArgs,
	writeShardConfigs,
} from './svelte-check.mjs'


const fixture = async () => {
	const root = await fs.mkdtemp(path.join(os.tmpdir(), 'blockhead-svelte-check-'))
	await fs.mkdir(path.join(root, 'src/views'), { recursive: true })
	await fs.mkdir(path.join(root, 'src/components'), { recursive: true })
	await fs.writeFile(path.join(root, 'tsconfig.json'), `${JSON.stringify({
		compilerOptions: {
			allowJs: true,
			noEmit: true,
			strict: true,
		},
		include: [
			'src/**/*.d.ts',
			'src/**/*.svelte',
		],
		exclude: ['src/**/*.test.svelte'],
	}, null, '\t')}\n`)
	await fs.writeFile(path.join(root, 'src/globals.d.ts'), 'declare const fixtureGlobal: string\n')
	await fs.writeFile(
		path.join(root, 'src/components/Shared.svelte'),
		'<script lang="ts">let value: string = "shared"</script>\n<p>{value}</p>\n'
	)
	for (const [name, content] of [
		['Alpha', '<script lang="ts" generics="_Value extends Record<string, unknown>">import Shared from "$/components/Shared.svelte"</script>\n<Shared />\n'],
		['Beta', '<script lang="ts">import Shared from "$/components/Shared.svelte"</script>\n<Shared />\n'],
		['Gamma', '<p>gamma</p>\n'],
	])
		await fs.writeFile(path.join(root, `src/views/${name}.svelte`), content)
	await fs.writeFile(path.join(root, 'src/views/Ignored.test.svelte'), '<p>ignored</p>\n')

	return root
}

const executable = async (root, name, source) => {
	const filePath = path.join(root, name)
	await fs.writeFile(filePath, source, { mode: 0o755 })
	return filePath
}

test('discovers every canonical active Svelte root and partitions deterministically once', async () => {
	const root = await fixture()
	const tsconfigPath = path.join(root, 'tsconfig.json')
	const roots = readCanonicalSvelteRoots(root, tsconfigPath)
	const manifest = readCanonicalFileManifest(root, tsconfigPath)
	assert.deepEqual(
		roots.map((filePath) => path.relative(root, filePath)),
		[
			'src/components/Shared.svelte',
			'src/views/Alpha.svelte',
			'src/views/Beta.svelte',
			'src/views/Gamma.svelte',
		]
	)

	const graph = await readSvelteGraph(root, roots)
	const forward = partitionSvelteRoots(roots, graph, 2)
	const reversed = partitionSvelteRoots([...roots].reverse(), graph, 2)
	assert.deepEqual(forward, reversed)
	assert.deepEqual(
		[...forward.flatMap((shard) => shard.roots)].sort(),
		roots
	)
	assert.equal(new Set(forward.flatMap((shard) => shard.roots)).size, roots.length)
	assert.equal(forward.every((shard) => shard.roots.length > 0), true)
	assert.equal(Math.max(...forward.map((shard) => shard.roots.length)), 3)
	assert.deepEqual(
		manifest.declarationFiles.map((filePath) => path.relative(root, filePath)),
		['src/globals.d.ts']
	)
})

test('emits unchanged canonical inheritance without shard exclusions', async () => {
	const root = await fixture()
	const tsconfigPath = path.join(root, 'tsconfig.json')
	const roots = readCanonicalSvelteRoots(root, tsconfigPath)
	const shards = partitionSvelteRoots(roots, await readSvelteGraph(root, roots), 2)
	const written = await writeShardConfigs(
		tsconfigPath,
		path.join(root, 'shards'),
		shards
	)

	for (const shard of written) {
		const config = JSON.parse(await fs.readFile(shard.configPath, 'utf8'))
		assert.equal(config.extends, tsconfigPath)
		assert.equal('files' in config, false)
		assert.deepEqual(config.include, shard.roots)
		assert.equal('exclude' in config, false)
		assert.equal('compilerOptions' in config, false)
	}
})

test('keeps every shard nonincremental with complete diagnostics and fatal warnings', () => {
	const args = svelteCheckArgs('/project', '/project/shard.json')
	assert.deepEqual(args, [
		'--workspace',
		'/project',
		'--tsconfig',
		'/project/shard.json',
		'--output',
		'machine',
		'--compiler-warnings',
		fatalCompilerWarnings,
	])
	for (const forbidden of [
		'--incremental',
		'--tsgo',
		'--tsgo-experimental-api',
		'--no-tsconfig',
		'--diagnostic-sources',
		'--threshold',
	])
		assert.equal(args.includes(forbidden), false)
})

test('bounds concurrency, propagates diagnostics, and invokes every shard', async () => {
	const root = await fixture()
	const activityPath = path.join(root, 'activity.log')
	const fakeChecker = await executable(root, 'fake-checker.mjs', `#!/usr/bin/env node
import fs from 'node:fs'
const configPath = process.argv[process.argv.indexOf('--tsconfig') + 1]
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
fs.appendFileSync(process.env.ACTIVITY_PATH, 'start ' + configPath + '\\n')
await new Promise((resolve) => setTimeout(resolve, 40))
fs.appendFileSync(process.env.ACTIVITY_PATH, 'end ' + configPath + '\\n')
if (config.include.some((file) => file.endsWith('Gamma.svelte'))) {
	console.error('Gamma.svelte:1:1 synthetic diagnostic')
	process.exitCode = 1
}
`)
	const shards = await writeShardConfigs(
		path.join(root, 'tsconfig.json'),
		path.join(root, 'shards'),
		[
			{ id: 'shard-01', roots: [path.join(root, 'src/views/Alpha.svelte')], weight: 1 },
			{ id: 'shard-02', roots: [path.join(root, 'src/views/Beta.svelte')], weight: 1 },
			{ id: 'shard-03', roots: [path.join(root, 'src/views/Gamma.svelte')], weight: 1 },
		]
	)
	const results = await runShardQueue({
		shards,
		command: fakeChecker,
		projectRoot: root,
		concurrency: 2,
		shardTimeoutMs: 5_000,
		deadline: Date.now() + 10_000,
		environment: {
			...process.env,
			ACTIVITY_PATH: activityPath,
		},
	})
	assert.equal(results.length, 3)
	assert.equal(results.filter((result) => result.code === 0).length, 2)
	assert.match(results.find((result) => result.code !== 0).output, /synthetic diagnostic/)
	const activity = (await fs.readFile(activityPath, 'utf8')).trim().split('\n')
	let active = 0
	let maximum = 0
	for (const line of activity) {
		active += line.startsWith('start ') ? 1 : -1
		maximum = Math.max(maximum, active)
	}
	assert.equal(maximum, 2)
	assert.equal(active, 0)
	assert.equal(activity.filter((line) => line.startsWith('start ')).length, 3)
})

test('stops scheduling new shards after the first failed wave', async () => {
	const root = await fixture()
	const activityPath = path.join(root, 'activity.log')
	const fakeChecker = await executable(root, 'fail-fast-checker.mjs', `#!/usr/bin/env node
import fs from 'node:fs'
const configPath = process.argv[process.argv.indexOf('--tsconfig') + 1]
fs.appendFileSync(process.env.ACTIVITY_PATH, configPath + '\\n')
process.exitCode = configPath.endsWith('shard-01.json') ? 1 : 0
`)
	const shards = await writeShardConfigs(
		path.join(root, 'tsconfig.json'),
		path.join(root, 'shards'),
		Array.from({ length: 4 }, (_, index) => ({
			id: `shard-0${index + 1}`,
			roots: [path.join(root, 'src/views/Gamma.svelte')],
			weight: 1,
		}))
	)
	const results = await runShardQueue({
		shards,
		command: fakeChecker,
		projectRoot: root,
		concurrency: 1,
		shardTimeoutMs: 1_000,
		deadline: Date.now() + 2_000,
		environment: {
			...process.env,
			ACTIVITY_PATH: activityPath,
		},
	})
	assert.deepEqual(results.map((result) => result.label), ['shard-01'])
	assert.equal((await fs.readFile(activityPath, 'utf8')).trim().split('\n').length, 1)
})

test('kills a timed-out checker process group and reports failure', async () => {
	const root = await fixture()
	const childMarker = path.join(root, 'child-alive')
	const hangingChecker = await executable(root, 'hanging-checker.mjs', `#!/usr/bin/env node
import { spawn } from 'node:child_process'
spawn(process.execPath, ['-e', ${JSON.stringify(`setTimeout(() => require('node:fs').writeFileSync(${JSON.stringify(childMarker)}, 'alive'), 500)`)}], { stdio: 'ignore' })
await new Promise(() => {})
`)
	const result = await runProcess({
		command: hangingChecker,
		args: [],
		cwd: root,
		timeoutMs: 50,
		label: 'timeout',
	})
	assert.equal(result.timedOut, true)
	assert.notEqual(result.code, 0)
	await new Promise((resolve) => setTimeout(resolve, 650))
	await assert.rejects(fs.access(childMarker))
})

test('reports phase start, liveness, and terminal state while a checker runs', async () => {
	const root = await fixture()
	const checker = await executable(root, 'progress-checker.mjs', `#!/usr/bin/env node
await new Promise((resolve) => setTimeout(resolve, 40))
`)
	let progress = ''
	const write = process.stderr.write
	process.stderr.write = (chunk) => {
		progress += chunk
		return true
	}
	try {
		const result = await runProcess({
			command: checker,
			args: [],
			cwd: root,
			timeoutMs: 1_000,
			label: 'progress',
			heartbeatMs: 10,
		})
		assert.equal(result.code, 0)
	} finally {
		process.stderr.write = write
	}
	assert.match(progress, /^progress: START\n/)
	assert.match(progress, /progress: RUNNING/)
	assert.match(progress, /progress: PASS/)
})

test('shard union preserves root, dependency, TypeScript, Svelte, and CSS diagnostics', async () => {
	const root = await fixture()
	await fs.writeFile(
		path.join(root, 'src/views/RootTypeError.svelte'),
		'<script lang="ts">let rootValue: string = 1</script>\n<p>{rootValue}</p>\n'
	)
	await fs.writeFile(
		path.join(root, 'src/components/DependencyTypeError.svelte'),
		'<script lang="ts">let dependencyValue: string = 1</script>\n<p>{dependencyValue}</p>\n'
	)
	await fs.writeFile(
		path.join(root, 'src/views/DependencyConsumer.svelte'),
		'<script lang="ts">import DependencyTypeError from "../components/DependencyTypeError.svelte"</script>\n<DependencyTypeError />\n'
	)
	await fs.writeFile(path.join(root, 'src/views/ordinary.ts'), 'export const ordinaryValue: string = 1\n')
	await fs.writeFile(
		path.join(root, 'src/views/OrdinaryTypeScriptConsumer.svelte'),
		'<script lang="ts">import { ordinaryValue } from "./ordinary.ts"</script>\n<p>{ordinaryValue}</p>\n'
	)
	await fs.writeFile(
		path.join(root, 'src/views/SvelteWarning.svelte'),
		'<script lang="ts">let count = $state(0)\nconst captured = count</script>\n<p>{captured}</p>\n'
	)
	await fs.writeFile(
		path.join(root, 'src/views/CssDiagnostic.svelte'),
		'<p>css</p>\n<style>.unused { color: red; }</style>\n'
	)

	const tsconfigPath = path.join(root, 'tsconfig.json')
	const roots = readCanonicalSvelteRoots(root, tsconfigPath)
	const graph = await readSvelteGraph(root, roots)
	const shards = await writeShardConfigs(
		tsconfigPath,
		path.join(root, 'shards'),
		partitionSvelteRoots(roots, graph, 3),
		readCanonicalFileManifest(root, tsconfigPath).declarationFiles
	)
	const checker = path.resolve('node_modules/.bin/svelte-check')
	const monolithic = await runProcess({
		command: checker,
		args: svelteCheckArgs(root, tsconfigPath),
		cwd: root,
		timeoutMs: 30_000,
		label: 'monolithic',
	})
	const shardResults = await Promise.all(shards.map((shard) => runProcess({
		command: checker,
		args: svelteCheckArgs(root, shard.configPath),
		cwd: root,
		timeoutMs: 30_000,
		label: shard.id,
	})))
	const shardOutput = shardResults.map((result) => result.output).join('\n')

	assert.notEqual(monolithic.code, 0)
	assert.equal(shardResults.some((result) => result.code !== 0), true)
	for (const fileName of [
		'RootTypeError.svelte',
		'DependencyTypeError.svelte',
		'ordinary.ts',
		'SvelteWarning.svelte',
		'CssDiagnostic.svelte',
	]) {
		assert.match(monolithic.output, new RegExp(fileName.replace('.', '\\.')), `monolithic missed ${fileName}`)
		assert.match(shardOutput, new RegExp(fileName.replace('.', '\\.')), `shards missed ${fileName}`)
	}
})
