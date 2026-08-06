import { glob, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import openapiTS, { astToString } from 'openapi-typescript'

/**
 * Syncs Google Discovery documents under src/sources/<Provider>/Discovery/.
 *
 * Converts Discovery schemas into an OpenAPI 3 components document and emits
 * TypeScript via openapi-typescript (same stack as sources:openapi).
 * Does not invent REST paths — only schema wire types.
 *
 * Replication contract:
 * 1. Add src/sources/<Provider>/Discovery/schema-source.ts
 * 2. Export schemaSource with schemaUrl, schemaFile, typesFile
 * 3. Run `pnpm run sources:discovery` to sync all, or `-- <Provider>` to sync one
 *
 * CLI:
 *   pnpm run sources:discovery [-- <Provider>]
 *   pnpm run sources:discovery -- check [<Provider>]
 *   pnpm run sources:discovery -- generate [<Provider>]
 *   pnpm run sources:discovery -- dry-run [<Provider>]
 *   pnpm run sources:discovery -- help
 */
type DiscoverySchemaSource = {
	schemaUrl: string
	schemaFile: string
	typesFile: string
}

type LoadedDiscoverySchemaSource = {
	manifest: DiscoverySchemaSource
	manifestFile: string
	schemaFile: string
	typesFile: string
}

type OpenApiComponentsDocument = {
	openapi: '3.0.3'
	info: {
		title: string
		version: string
	}
	paths: Record<string, never>
	components: {
		schemas: unknown
	}
}

const usage = `
Usage:
  pnpm run sources:discovery [-- <Provider>]
  pnpm run sources:discovery -- check [<Provider>]
  pnpm run sources:discovery -- generate [<Provider>]
  pnpm run sources:discovery -- dry-run [<Provider>]
  pnpm run sources:discovery -- help

Discovers */Discovery/schema-source.ts under src/sources/.
Sync downloads schemaUrl → schemaFile, then generates typesFile via openapi-typescript
from Discovery schemas (no invented REST paths).
Provider is the first path segment under src/sources/ (e.g. Youtube).
`.trim()

const rootDir = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'../..'
)
const sourcesDir = join(rootDir, 'src/sources')

const discoverSchemaSources = async (filter?: string) => {
	const manifestFiles: string[] = []
	for await (const manifestPath of glob('*/Discovery/schema-source.ts', { cwd: sourcesDir })) {
		const provider = manifestPath.split('/')[0]
		if (filter == null || provider === filter)
			manifestFiles.push(resolve(sourcesDir, manifestPath))
	}

	if (filter != null && manifestFiles.length === 0)
		throw new Error(`No Discovery source found matching: ${filter}`)

	return manifestFiles.sort()
}

const loadSchemaSource = async (manifestFile: string): Promise<LoadedDiscoverySchemaSource> => {
	const module = await import(pathToFileURL(manifestFile).href)
	const manifest = module.schemaSource

	if (manifest == null || typeof manifest !== 'object')
		throw new Error(`Missing \`schemaSource\` export in ${manifestFile}`)

	const schemaSource = manifest as DiscoverySchemaSource
	if (typeof schemaSource.schemaUrl !== 'string' || schemaSource.schemaUrl === '')
		throw new Error(`${manifestFile}: schemaSource.schemaUrl must be a non-empty string`)
	if (typeof schemaSource.schemaFile !== 'string' || schemaSource.schemaFile === '')
		throw new Error(`${manifestFile}: Discovery schemaSource requires schemaFile`)
	if (typeof schemaSource.typesFile !== 'string' || schemaSource.typesFile === '')
		throw new Error(`${manifestFile}: Discovery schemaSource requires typesFile`)

	return {
		manifest: schemaSource,
		manifestFile,
		schemaFile: resolve(dirname(manifestFile), schemaSource.schemaFile),
		typesFile: resolve(dirname(manifestFile), schemaSource.typesFile),
	}
}

const rewriteDiscoveryRefs = (value: unknown): unknown => {
	if (Array.isArray(value))
		return value.map(rewriteDiscoveryRefs)
	if (value == null || typeof value !== 'object')
		return value

	const next: Record<string, unknown> = {}
	for (const [key, child] of Object.entries(value)) {
		if (key === '$ref' && typeof child === 'string' && !child.startsWith('#'))
			next[key] = `#/components/schemas/${child}`
		else
			next[key] = rewriteDiscoveryRefs(child)
	}
	return next
}

const discoveryDocumentToOpenApi = (discovery: Record<string, unknown>): OpenApiComponentsDocument => {
	const schemas = discovery.schemas
	if (schemas == null || typeof schemas !== 'object')
		throw new Error('Discovery document is missing schemas')

	return {
		openapi: '3.0.3',
		info: {
			title: (
				typeof discovery.title === 'string' ?
					discovery.title
				: typeof discovery.name === 'string' ?
					discovery.name
				:
					'Google Discovery API'
			),
			version: (
				typeof discovery.version === 'string' ?
					discovery.version
				:
					'0.0.0'
			),
		},
		paths: {},
		components: {
			schemas: rewriteDiscoveryRefs(schemas),
		},
	}
}

const downloadSchema = async ({
	manifest,
	schemaFile,
}: {
	manifest: DiscoverySchemaSource
	schemaFile: string
}) => {
	const response = await fetch(manifest.schemaUrl)
	if (!response.ok)
		throw new Error(`Failed to download schema: ${response.status} ${response.statusText}`)

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
	const discovery = JSON.parse(await readFile(schemaFile, 'utf8')) as Record<string, unknown>
	const output = await openapiTS(
		discoveryDocumentToOpenApi(discovery) as Parameters<typeof openapiTS>[0]
	)
	await writeFile(typesFile, astToString(output))
	console.log(`Generated types at ${typesFile}`)
}

const checkTypes = async (loaded: LoadedDiscoverySchemaSource) => {
	console.log(`Checking ${relative(sourcesDir, loaded.manifestFile)}`)
	const tempDir = await mkdtemp(join(tmpdir(), 'blockhead-discovery-'))
	const tempTypesFile = join(tempDir, 'discovery.d.ts')

	try {
		await generateTypes({
			schemaFile: loaded.schemaFile,
			typesFile: tempTypesFile,
		})

		const [
			actual,
			expected,
		] = await Promise.all([
			readFile(tempTypesFile, 'utf8'),
			readFile(loaded.typesFile, 'utf8'),
		])

		if (actual !== expected)
			throw new Error(`${loaded.manifestFile}: generated Discovery types drift from checked-in ${loaded.typesFile}`)
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}
}

const syncSchemaSource = async (loaded: LoadedDiscoverySchemaSource) => {
	console.log(`Syncing ${relative(sourcesDir, loaded.manifestFile)}`)
	await downloadSchema({
		manifest: loaded.manifest,
		schemaFile: loaded.schemaFile,
	})
	await generateTypes({
		schemaFile: loaded.schemaFile,
		typesFile: loaded.typesFile,
	})
}

const dryRunSchemaSource = (loaded: LoadedDiscoverySchemaSource) => {
	console.log(
		`${relative(sourcesDir, loaded.manifestFile)}: sync schemaUrl=${loaded.manifest.schemaUrl} schemaFile=${loaded.manifest.schemaFile} typesFile=${loaded.manifest.typesFile}`
	)
}

const argv = process.argv.slice(2).filter((arg) => arg !== '--')
const [
	modeOrFilter,
	filterAfterMode,
] = argv

if (modeOrFilter === 'help' || modeOrFilter === '--help' || modeOrFilter === '-h') {
	console.log(usage)
	process.exit(0)
}

const mode = (
	modeOrFilter === 'check'
	|| modeOrFilter === 'generate'
	|| modeOrFilter === 'dry-run' ?
		modeOrFilter
	:
		'sync'
)
const filter = (
	mode === 'sync' ?
		modeOrFilter
	:
		filterAfterMode
)

for (const manifestFile of await discoverSchemaSources(filter)) {
	const loaded = await loadSchemaSource(manifestFile)
	if (mode === 'dry-run')
		dryRunSchemaSource(loaded)
	else if (mode === 'check')
		await checkTypes(loaded)
	else if (mode === 'generate') {
		console.log(`Generating ${relative(sourcesDir, loaded.manifestFile)}`)
		await generateTypes({
			schemaFile: loaded.schemaFile,
			typesFile: loaded.typesFile,
		})
	} else
		await syncSchemaSource(loaded)
}
