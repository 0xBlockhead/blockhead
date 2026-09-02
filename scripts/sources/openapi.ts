import { glob, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import openapiTS, { astToString } from 'openapi-typescript'
import swagger2openapi from 'swagger2openapi'
import YAML from 'yaml'

/**
 * Syncs provider-local `schema-source.ts` manifests anywhere below
 * `src/sources/<Provider>/OpenApi/`, including variant contracts such as `OpenApi/Pro/`.
 *
 * Replication contract:
 * 1. Add a `schema-source.ts` below `src/sources/<Provider>/OpenApi/`
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

const discoverSchemaSources = async (filter?: string) => {
	const manifestFiles = new Set<string>()
	for (const pattern of [
		'*/OpenApi/schema-source.ts',
		'*/OpenApi/**/schema-source.ts',
	])
		for await (const manifestPath of glob(pattern, { cwd: sourcesDir })) {
			const provider = manifestPath.split('/')[0]
			if (filter == null || provider === filter)
				manifestFiles.add(resolve(sourcesDir, manifestPath))
		}

	if (filter != null && manifestFiles.size === 0)
		throw new Error(`No OpenAPI source found matching: ${filter}`)

	return [...manifestFiles].sort()
}

const loadSchemaSource = async (manifestFile: string): Promise<{
	manifest: OpenApiSchemaSource
	manifestFile: string
	schemaFile: string
	typesFile: string
}> => {
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

const patchLifiOpenApiSpec = (
	spec: Record<string, unknown>,
	schemaFile: string
) => {
	if (!schemaFile.endsWith('/src/sources/Lifi/OpenApi/openapi.yaml'))
		return spec

	const components = spec.components
	if (components == null || typeof components !== 'object')
		return spec

	const responses = (components as Record<string, unknown>).responses
	if (responses == null || typeof responses !== 'object')
		return spec

	const responseByName = responses as Record<string, unknown>
	if (responseByName.WalletAnalyticsResponse == null)
		responseByName.WalletAnalyticsResponse = responseByName.TransfersResponse

	return spec
}

const hasLocalOpenApiRefs = (schemaText: string) => (
	schemaText.includes('$ref: "./')
	|| schemaText.includes('$ref: \'./')
	|| schemaText.includes('"$ref": "./')
)

const parseSchema = async (
	schemaText: string,
	schemaFile: string
) => {
	const parsedSchema = (
		schemaFile.endsWith('.yaml') || schemaFile.endsWith('.yml') ?
			YAML.parse(schemaText)
		:
			JSON.parse(schemaText)
	)

	const converted = (
		typeof parsedSchema?.swagger === 'string' ?
			(await swagger2openapi.convertObj(parsedSchema, {
				resolve: true,
				source: schemaFile,
			})).openapi
		:
			parsedSchema
	)

	return patchLifiOpenApiSpec(dedupeOpenApiOperationIds(converted), schemaFile)
}

const localRefPattern = /\$ref:\s*['"]?((?:\.{1,2}\/)?(?!\/)[^'"\s#:]+)(?:#[^'"\s]*)?['"]?|"\$ref"\s*:\s*"((?:\.{1,2}\/)?(?!\/)[^"#:]+)(?:#[^"]*)?"/g

export const transferOpenApiSchemaTree = async ({
	schemaUrl,
	schemaFile,
	mode,
	fetchSchema = fetch,
}: {
	schemaUrl: string
	schemaFile: string
	mode: 'freshness' | 'sync'
	fetchSchema?: typeof fetch
}) => {
	const pending = [{
		file: schemaFile,
		url: new URL(schemaUrl),
	}]
	const seen = new Set<string>()

	for (const current of pending) {
		if (seen.has(current.file)) continue
		seen.add(current.file)

		const response = await fetchSchema(current.url)
		if (!response.ok)
			throw new Error(`Failed to download OpenAPI schema: ${response.status} ${response.statusText} ${current.url}`)
		const remoteText = await response.text()

		if (mode === 'sync') {
			await mkdir(dirname(current.file), { recursive: true })
			await writeFile(current.file, remoteText)
			console.log(`Downloaded schema to ${current.file}`)
		} else {
			const checkedInText = await readFile(current.file, 'utf8')
			if (remoteText !== checkedInText)
				throw new Error(`Upstream OpenAPI schema drifted from checked-in ${current.file}`)
		}

		for (const match of remoteText.matchAll(localRefPattern)) {
			const refPath = match[1] ?? match[2]
			const refFile = resolve(dirname(current.file), refPath)
			if (seen.has(refFile)) continue
			pending.push({
				file: refFile,
				url: new URL(refPath, current.url),
			})
		}
	}
}

const generateTypes = async ({
	schemaFile,
	typesFile,
}: {
	schemaFile: string
	typesFile: string
}) => {
	await mkdir(dirname(typesFile), { recursive: true })
	const schemaText = await readFile(schemaFile, 'utf8')

	const output = await openapiTS(
		hasLocalOpenApiRefs(schemaText) && !/^(?:\s|#)*swagger:/m.test(schemaText) ?
			pathToFileURL(schemaFile)
		:
			await parseSchema(
				schemaText,
				schemaFile
			),
		{
			cwd: pathToFileURL(`${dirname(schemaFile)}/`),
		}
	)

	await writeFile(typesFile, astToString(output))

	console.log(`Generated types at ${typesFile}`)
}

const checkTypes = async (manifestFile: string) => {
	console.log(`Checking ${manifestFile.slice(sourcesDir.length + 1)}`)
	const { schemaFile, typesFile } = await loadSchemaSource(manifestFile)
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
			throw new Error(`${manifestFile}: generated OpenAPI types drift from checked-in ${typesFile}`)
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}
}

const syncSchemaSource = async (manifestFile: string) => {
	const { manifest, schemaFile, typesFile } = await loadSchemaSource(manifestFile)
	console.log(`Syncing ${manifestFile.slice(sourcesDir.length + 1)}`)
	await transferOpenApiSchemaTree({
		schemaUrl: manifest.schemaUrl,
		schemaFile,
		mode: 'sync',
	})
	await generateTypes({
		schemaFile,
		typesFile,
	})
}

const checkSchemaFreshness = async (manifestFile: string) => {
	const { manifest, schemaFile } = await loadSchemaSource(manifestFile)
	console.log(`Checking upstream freshness ${manifestFile.slice(sourcesDir.length + 1)}`)
	await transferOpenApiSchemaTree({
		schemaUrl: manifest.schemaUrl,
		schemaFile,
		mode: 'freshness',
	})
}

const main = async () => {
	const [
		modeOrFilter,
		filterAfterMode,
	] = process.argv.slice(2).filter((arg) => arg !== '--')
	const mode = modeOrFilter === 'check' || modeOrFilter === 'freshness' ? modeOrFilter : 'sync'
	const filter = mode === 'sync' ? modeOrFilter : filterAfterMode
	for (const manifestFile of await discoverSchemaSources(filter)) {
		if (mode === 'check')
			await checkTypes(manifestFile)
		else if (mode === 'freshness')
			await checkSchemaFreshness(manifestFile)
		else
			await syncSchemaSource(manifestFile)
	}
}

if (process.argv[1] != null && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
	await main()
