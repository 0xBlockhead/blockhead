import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { expect, it, vi } from 'vitest'
import { discoverModules, runGraphqlSources, downloadManifestSchemaText } from './graphql.ts'
import { schemaSource } from '../../src/sources/TheGraph/Messari/graphql-schema-source.ts'

const root = fileURLToPath(new URL('../../', import.meta.url))
const directory = fileURLToPath(new URL('../../src/sources/TheGraph/Messari/', import.meta.url))
const options = { rootDir: root }

it('discovers and canonically checks the named Messari captured schema without network', async () => {
	const fetch = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network forbidden'))
	try {
		expect(await discoverModules('TheGraph/Messari', options)).toEqual(['TheGraph/Messari'])
		await runGraphqlSources(['check', 'TheGraph/Messari'], options)
		expect(fetch).not.toHaveBeenCalled()
	} finally { fetch.mockRestore() }
})

it('rejects changed input digest and does not pretend capture freshness is live', async () => {
	const fetch = vi.fn().mockRejectedValue(new Error('network forbidden'))
	await expect(downloadManifestSchemaText({
		...schemaSource,
		checkedInSchema: { ...schemaSource.checkedInSchema, sha256: '0'.repeat(64) },
	}, fetch, directory)).rejects.toThrow(/digest mismatch/)
	await expect(runGraphqlSources(['freshness', 'TheGraph/Messari'], options)).rejects.toThrow(/no upstream freshness claim/)
	expect(fetch).not.toHaveBeenCalled()
})

it('retains exact checked-in executable SDL and old URL behavior', async () => {
	const sdl = await readFile(directory + 'schema.graphql', 'utf8')
	expect(createHash('sha256').update(sdl).digest('hex')).toBe(schemaSource.checkedInSchema.sha256)
	expect(await downloadManifestSchemaText(schemaSource, vi.fn(), directory)).toBe(sdl)
	const fetch = vi.fn().mockResolvedValue(new Response('type Query { value: String }'))
	expect(await downloadManifestSchemaText({
		schemaUrl: 'https://example.test/schema.graphql', schemaFile: 'schema.graphql', outputFile: 'graphql-env.d.ts',
	}, fetch)).toContain('type Query { value: String }')
	expect(fetch).toHaveBeenCalledTimes(1)
})

it('accepts a complete captured introspection object through the GraphQL schema owner', async () => {
	const file = fileURLToPath(new URL('./fixtures/executable-introspection.json', import.meta.url))
	const bytes = await readFile(file)
	const fetch = vi.fn().mockRejectedValue(new Error('network forbidden'))
	const schema = await downloadManifestSchemaText({
		checkedInSchema: { file, format: 'introspection', sha256: createHash('sha256').update(bytes).digest('hex') },
		schemaFile: 'schema.graphql',
	}, fetch)
	expect(schema).toBe('type Query {\n  value: String\n}\n')
	expect(fetch).not.toHaveBeenCalled()
})
