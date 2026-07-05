import { glob, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import openapiTS, { astToString } from 'openapi-typescript'
import swagger2openapi from 'swagger2openapi'
import YAML from 'yaml'

/**
 * Syncs provider-local `src/sources/<Provider>/OpenApi/schema-source.ts` manifests.
 *
 * Replication contract:
 * 1. Add `src/sources/<Provider>/OpenApi/schema-source.ts`
 * 2. Export `schemaSource` with `schemaUrl`, `schemaFile`, `typesFile`
 * 3. Run `pnpm run sources:openapi` to sync all, or `-- <Provider>` to sync one
 */
type OpenApiSchemaSource = {
	schemaUrl: string
	schemaFile: string
	typesFile: string
}

const rootDir = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'../..'
)
const sourcesDir = join(rootDir, 'src/sources')

const discoverProviders = async (filter?: string): Promise<string[]> => {
	const providers: string[] = []
	for await (const manifestPath of glob('*/OpenApi/schema-source.ts', { cwd: sourcesDir })) {
		const provider = manifestPath.split('/')[0]
		if (filter == null || provider === filter) providers.push(provider)
	}
	if (filter != null && providers.length === 0) throw new Error(`No OpenAPI source found matching: ${filter}`)
	return providers
}

const loadSchemaSource = async (provider: string): Promise<{
	manifest: OpenApiSchemaSource
	manifestFile: string
	schemaFile: string
	typesFile: string
}> => {
	const manifestFile = resolve(
		sourcesDir,
		provider,
		'OpenApi/schema-source.ts'
	)
	const module = await import(pathToFileURL(manifestFile).href)
	const manifest = module.schemaSource as OpenApiSchemaSource | undefined

	if (manifest == null) {
		throw new Error(`Missing \`schemaSource\` export in ${manifestFile}`)
	}

	return {
		manifest,
		manifestFile,
		schemaFile: resolve(dirname(manifestFile), manifest.schemaFile),
		typesFile: resolve(dirname(manifestFile), manifest.typesFile),
	}
}

/** Upstream specs (e.g. Coinpaprika) may reuse operationIds; openapi-typescript requires uniqueness. */
const dedupeOpenApiOperationIds = (
	spec: Record<string, unknown>
): Record<string, unknown> => {
	const paths = spec.paths
	if (paths == null || typeof paths !== 'object') return spec

	const seen = new Map<string, number>()

	for (const [pathKey, pathItem] of Object.entries(paths)) {
		if (pathItem == null || typeof pathItem !== 'object') continue

		for (const method of [
			'get',
			'put',
			'post',
			'delete',
			'patch',
			'options',
			'head',
			'trace',
		]) {
			const operation = (pathItem as Record<string, unknown>)[method]
			if (operation == null || typeof operation !== 'object') continue

			const operationId = (operation as { operationId?: string }).operationId
			if (operationId == null || operationId === '') continue

			const count = seen.get(operationId) ?? 0
			if (count > 0) {
				(operation as { operationId: string }).operationId = (
					`${operationId}__${pathKey.replace(/^\//, '').replace(/\//g, '_')}`
				)
			}
			seen.set(operationId, count + 1)
		}
	}

	return spec
}

const parseSchema = async (schemaFile: string) => {
	const schemaText = await readFile(schemaFile, 'utf8')
	const parsedSchema = (
		schemaFile.endsWith('.yaml') || schemaFile.endsWith('.yml') ?
			YAML.parse(schemaText)
		:
			JSON.parse(schemaText)
	)

	const converted = (
		typeof parsedSchema?.swagger === 'string' ?
			(await swagger2openapi.convertObj(parsedSchema, {})).openapi
		:
			parsedSchema
	)

	return dedupeOpenApiOperationIds(converted)
}

const downloadSchema = async ({
	manifest,
	schemaFile,
}: {
	manifest: OpenApiSchemaSource
	schemaFile: string
}) => {
	const response = await fetch(manifest.schemaUrl)

	if (!response.ok) {
		throw new Error(`Failed to download schema: ${response.status} ${response.statusText}`)
	}

	await mkdir(dirname(schemaFile), { recursive: true })
	await writeFile(
		schemaFile,
		await response.text()
	)

	console.log(`Downloaded schema to ${schemaFile}`)
}

const generateTypes = async ({
	schemaFile,
	typesFile,
}: {
	schemaFile: string
	typesFile: string
}) => {
	await mkdir(dirname(typesFile), { recursive: true })

	const output = await openapiTS(
		await parseSchema(schemaFile)
	)

	await writeFile(typesFile, astToString(output))

	console.log(`Generated types at ${typesFile}`)
}

const checkTypes = async (provider: string) => {
	console.log(`Checking ${provider}`)
	const { schemaFile, typesFile } = await loadSchemaSource(provider)
	const tempDir = await mkdtemp(join(tmpdir(), 'blockhead-openapi-'))
	const tempTypesFile = join(tempDir, 'openapi.d.ts')

	try {
		await generateTypes({
			schemaFile,
			typesFile: tempTypesFile,
		})

		const [
			actual,
			expected,
		] = await Promise.all([
			readFile(tempTypesFile, 'utf8'),
			readFile(typesFile, 'utf8'),
		])

		if (actual !== expected)
			throw new Error(`${provider}: generated OpenAPI types drift from checked-in ${typesFile}`)
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}
}

const syncProvider = async (provider: string) => {
	const { manifest, schemaFile, typesFile } = await loadSchemaSource(provider)
	console.log(`Syncing ${provider}`)
	await downloadSchema({
		manifest,
		schemaFile,
	})
	await generateTypes({
		schemaFile,
		typesFile,
	})
}

const [
	modeOrFilter,
	filterAfterMode,
] = process.argv.slice(2).filter((arg) => arg !== '--')
const check = modeOrFilter === 'check'
for (const provider of await discoverProviders(check ? filterAfterMode : modeOrFilter)) {
	if (check)
		await checkTypes(provider)
	else
		await syncProvider(provider)
}
