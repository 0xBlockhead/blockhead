import { readFile, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pathToFileURL } from 'node:url'

import {
	buildSchema,
	introspectionFromSchema,
} from 'graphql'
import {
	checkFreshnessModule,
	downloadManifestSchemaText,
	normalizeGraphqlSchemaText,
	runGraphqlSources,
} from '../sources/graphql.ts'

const rootDir = resolve(import.meta.dirname, '../..')
const sourcesDir = resolve(rootDir, 'src/sources')
const typedModules = [
	'Amboss/Graphql',
	'AptosIndexer/Graphql',
	'Arweave/Graphql',
	'EasScan/Graphql',
	'Lens/Graphql',
	'SnapshotHub/Graphql',
	'Sui/Graphql',
	'TheGraph/Graphql/Ens',
]

const manifestAndSchema = async (sourceModule) => {
	const manifestFile = resolve(sourcesDir, sourceModule, 'schema-source.ts')
	const { schemaSource: manifest } = await import(pathToFileURL(manifestFile).href)
	const schemaFile = resolve(dirname(manifestFile), manifest.schemaFile)
	return {
		manifest,
		schemaFile,
		schemaText: await readFile(schemaFile, 'utf8'),
	}
}

const upstreamResponse = (
	manifest,
	schemaText
) => (
	new URL(manifest.schemaUrl).pathname.replace(/\/$/, '').endsWith('/graphql') ?
		new Response(JSON.stringify({
			data: introspectionFromSchema(buildSchema(schemaText)),
		}))
	:
		new Response(schemaText)
)

test('checks every typed manifest freshness without writing schemas', async () => {
	for (const sourceModule of typedModules) {
		const {
			manifest,
			schemaFile,
			schemaText,
		} = await manifestAndSchema(sourceModule)
		const before = await stat(schemaFile, { bigint: true })
		let fetchCount = 0
		const fetchSchema = async () => {
			fetchCount += 1
			return upstreamResponse(manifest, schemaText)
		}

		await checkFreshnessModule(sourceModule, fetchSchema).catch((error) => {
			assert.match(error.message, /GraphQL schema drifts from official/)
		})

		assert.equal(fetchCount, 1)
		assert.equal(await readFile(schemaFile, 'utf8'), schemaText)
		assert.equal((await stat(schemaFile, { bigint: true })).mtimeNs, before.mtimeNs)
	}
})

test('keeps snapshot-only upstream payloads exact', async () => {
	const payload = {
		data: {
			__schema: null,
		},
		extensions: {
			providerRevision: 'fixture',
		},
	}
	const fetchSchema = async () => new Response(JSON.stringify(payload))

	assert.equal(await downloadManifestSchemaText({
		schemaUrl: 'https://example.test/graphql',
		schemaFile: './schema.json',
	}, fetchSchema), `${JSON.stringify(payload, null, '\t')}\n`)
})

test('normalizes ordinary typed upstream SDL through the sync path', async () => {
	const upstream = 'type Query { value: String }  \n'
	const fetchSchema = async () => new Response(upstream)

	assert.equal(await downloadManifestSchemaText({
		schemaUrl: 'https://example.test/schema.graphql',
		schemaFile: './schema.graphql',
		outputFile: './graphql-env.d.ts',
	}, fetchSchema), normalizeGraphqlSchemaText(upstream))
})

test('keeps generated-type checks separate from upstream freshness', async () => {
	let fetchCount = 0
	const originalFetch = globalThis.fetch
	globalThis.fetch = async () => {
		fetchCount += 1
		return new Response('type Query { mutated: String }\n')
	}
	try {
		await runGraphqlSources(['check', 'Lens/Graphql'])
		assert.equal(fetchCount, 0)

		await assert.rejects(
			runGraphqlSources(['freshness', 'Lens/Graphql']),
			/GraphQL schema drifts from official/
		)
		assert.equal(fetchCount, 1)
	} finally {
		globalThis.fetch = originalFetch
	}
})
