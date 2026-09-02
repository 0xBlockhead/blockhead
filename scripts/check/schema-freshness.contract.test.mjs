import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { checkDiscoveryFreshness } from '../sources/discovery.ts'
import { checkOpenRpcFreshness } from '../sources/openrpc.ts'

test('schema freshness compares exact upstream text without writing checked-in schemas', async () => {
	const fixtureDir = await mkdtemp(join(tmpdir(), 'blockhead-schema-freshness-'))
	const schemaFile = join(fixtureDir, 'schema.json')
	const checkedInSchema = '{"version":"checked-in"}\n'
	const originalFetch = globalThis.fetch
	const originalLog = console.log
	const logs = []
	console.log = (message) => logs.push(String(message))

	const discovery = {
		manifest: {
			schemaUrl: 'https://official.example/discovery.json',
			schemaFile: './schema.json',
			typesFile: './schema.d.ts',
		},
		manifestFile: join(fixtureDir, 'Discovery/schema-source.ts'),
		schemaFile,
		typesFile: join(fixtureDir, 'schema.d.ts'),
	}
	const openRpc = {
		manifest: {
			schemaUrl: 'https://official.example/openrpc.json',
			schemaFile: './schema.json',
			typesFile: './schema.d.ts',
		},
		manifestFile: join(fixtureDir, 'OpenRpc/schema-source.ts'),
		schemaFile,
		typesFile: join(fixtureDir, 'schema.d.ts'),
	}

	try {
		await writeFile(schemaFile, checkedInSchema)

		globalThis.fetch = async () => new Response(checkedInSchema)
		await checkDiscoveryFreshness(discovery)
		await checkOpenRpcFreshness(openRpc)
		assert.equal(await readFile(schemaFile, 'utf8'), checkedInSchema)

		globalThis.fetch = async () => new Response(checkedInSchema.trimEnd())
		await assert.rejects(
			checkDiscoveryFreshness(discovery),
			/Discovery schema drifts from official https:\/\/official\.example\/discovery\.json/
		)
		await assert.rejects(
			checkOpenRpcFreshness(openRpc),
			/OpenRPC schema drifts from official https:\/\/official\.example\/openrpc\.json/
		)
		assert.equal(await readFile(schemaFile, 'utf8'), checkedInSchema)

		globalThis.fetch = async () => new Response('unavailable', {
			status: 503,
			statusText: 'Service Unavailable',
		})
		await assert.rejects(
			checkDiscoveryFreshness(discovery),
			/Failed to download schema: 503 Service Unavailable/
		)
		await assert.rejects(
			checkOpenRpcFreshness(openRpc),
			/Failed to download schema: 503 Service Unavailable/
		)

		let fetchCalled = false
		globalThis.fetch = async () => {
			fetchCalled = true
			throw new Error('schemaDirectory freshness must not crawl GitHub')
		}
		const schemaDirectoryManifest = join(
			fixtureDir,
			'EvmExecutionJsonRpc/schema-source.ts'
		)
		await checkOpenRpcFreshness({
			manifest: {
				schemaUrl: 'https://github.com/ethereum/execution-apis',
				schemaDirectory: './src',
			},
			manifestFile: schemaDirectoryManifest,
			schemaFile: undefined,
			typesFile: undefined,
		})
		assert.equal(fetchCalled, false)
		assert.equal(
			logs.at(-1)?.endsWith(
				'EvmExecutionJsonRpc/schema-source.ts freshness: schemaDirectory manifests do not declare one comparable schemaFile'
			),
			true
		)
	} finally {
		globalThis.fetch = originalFetch
		console.log = originalLog
		await rm(fixtureDir, { recursive: true, force: true })
	}
})
