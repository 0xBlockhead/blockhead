import { glob, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import openapiTS, { astToString } from 'openapi-typescript'

/**
 * Syncs OpenRPC documents under src/sources/.../OpenRpc/ and .../JsonRpc/.
 *
 * Collects components.schemas plus method param/result schemas into an OpenAPI 3
 * components document and emits TypeScript via openapi-typescript
 * (same stack as sources:openapi).
 *
 * Replication contract:
 * 1. Add schema-source.ts under an OpenRpc/ or JsonRpc/ folder
 * 2. Export schemaSource with schemaUrl, schemaFile, typesFile
 * 3. Run `pnpm run sources:openrpc` to sync all, or `-- <Filter>` matching a path segment
 *
 * Manifests without typesFile (e.g. execution-apis fragment directories) are skipped.
 *
 * CLI:
 *   pnpm run sources:openrpc [-- <Filter>]
 *   pnpm run sources:openrpc -- check [<Filter>]
 *   pnpm run sources:openrpc -- generate [<Filter>]
 *   pnpm run sources:openrpc -- dry-run [<Filter>]
 *   pnpm run sources:openrpc -- help
 */
type OpenRpcSchemaSource = {
	schemaUrl: string
	schemaFile?: string
	typesFile?: string
	schemaDirectory?: string
}

type LoadedOpenRpcSchemaSource = {
	manifest: OpenRpcSchemaSource
	manifestFile: string
	schemaFile: string | undefined
	typesFile: string | undefined
}

type OpenApiComponentsDocument = {
	openapi: '3.0.3'
	info: {
		title: string
		version: string
	}
	paths: Record<string, never>
	components: {
		schemas: Record<string, unknown>
	}
}

const usage = `
Usage:
  pnpm run sources:openrpc [-- <Filter>]
  pnpm run sources:openrpc -- check [<Filter>]
  pnpm run sources:openrpc -- freshness [<Filter>]
  pnpm run sources:openrpc -- generate [<Filter>]
  pnpm run sources:openrpc -- dry-run [<Filter>]
  pnpm run sources:openrpc -- help

Discovers **/OpenRpc/schema-source.ts and **/JsonRpc/schema-source.ts under src/sources/.
Sync downloads schemaUrl → schemaFile, then generates typesFile via openapi-typescript.
Manifests without schemaFile+typesFile (e.g. EvmExecutionJsonRpc fragments) are skipped.
Filter matches any path segment under src/sources/ (e.g. MetaplexDasJsonRpc, Celestia, StarknetJsonRpc).
`.trim()

const rootDir = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'../..'
)
const sourcesDir = join(rootDir, 'src/sources')

const discoverSchemaSources = async (filter?: string) => {
	const manifestFiles: string[] = []
	for await (const manifestPath of glob('**/{OpenRpc,JsonRpc}/schema-source.ts', { cwd: sourcesDir })) {
		const relativePath = manifestPath.split('\\').join('/')
		if (filter == null || relativePath.includes(filter))
			manifestFiles.push(resolve(sourcesDir, manifestPath))
	}

	if (filter != null && manifestFiles.length === 0)
		throw new Error(`No OpenRPC source found matching: ${filter}`)

	return manifestFiles.sort()
}

const loadSchemaSource = async (manifestFile: string): Promise<LoadedOpenRpcSchemaSource> => {
	const module = await import(pathToFileURL(manifestFile).href)
	const manifest = module.schemaSource

	if (manifest == null || typeof manifest !== 'object')
		throw new Error(`Missing \`schemaSource\` export in ${manifestFile}`)

	const schemaSource = manifest as OpenRpcSchemaSource
	if (typeof schemaSource.schemaUrl !== 'string' || schemaSource.schemaUrl === '')
		throw new Error(`${manifestFile}: schemaSource.schemaUrl must be a non-empty string`)

	return {
		manifest: schemaSource,
		manifestFile,
		schemaFile: (
			typeof schemaSource.schemaFile === 'string' ?
				resolve(dirname(manifestFile), schemaSource.schemaFile)
			:
				undefined
		),
		typesFile: (
			typeof schemaSource.typesFile === 'string' ?
				resolve(dirname(manifestFile), schemaSource.typesFile)
			:
				undefined
		),
	}
}

const schemaComponentName = (
	title: unknown,
	fallback: string
) => {
	const fromTitle = (
		typeof title === 'string' ?
			title
				.replace(/[^A-Za-z0-9]+/g, '_')
				.replace(/^_+|_+$/g, '')
		:
			''
	)
	return fromTitle.length > 0 ? fromTitle : fallback
}

const collectOpenRpcSchemas = (document: Record<string, unknown>) => {
	const components = document.components
	const componentSchemas = (
		components != null
		&& typeof components === 'object'
		&& 'schemas' in components
		&& components.schemas != null
		&& typeof components.schemas === 'object' ?
			{
				...components.schemas as Record<string, unknown>,
			}
		:
			{} as Record<string, unknown>
	)

	const addSchema = (
		schema: unknown,
		fallbackName: string
	) => {
		if (schema == null || typeof schema !== 'object')
			return

		const name = schemaComponentName(
			'title' in schema ? schema.title : undefined,
			fallbackName
		)
		if (componentSchemas[name] == null)
			componentSchemas[name] = schema
	}

	const methods = document.methods
	if (Array.isArray(methods)) {
		for (const method of methods) {
			if (method == null || typeof method !== 'object')
				continue

			const methodName = schemaComponentName(
				'name' in method ? method.name : undefined,
				'Method'
			)
			const params = 'params' in method ? method.params : undefined
			if (Array.isArray(params)) {
				for (const [index, param] of params.entries()) {
					if (param == null || typeof param !== 'object')
						continue
					addSchema(
						'schema' in param ? param.schema : undefined,
						`${methodName}_Param${index}_${schemaComponentName('name' in param ? param.name : undefined, String(index))}`
					)
				}
			}

			const result = 'result' in method ? method.result : undefined
			if (result != null && typeof result === 'object')
				addSchema(
					'schema' in result ? result.schema : undefined,
					`${methodName}_Result`
				)
		}
	}

	return componentSchemas
}

const openRpcDocumentToOpenApi = (document: Record<string, unknown>): OpenApiComponentsDocument => {
	const info = (
		document.info != null && typeof document.info === 'object' ?
			document.info
		:
			{}
	)

	return {
		openapi: '3.0.3',
		info: {
			title: (
				'title' in info && typeof info.title === 'string' ?
					info.title
				:
					'OpenRPC'
			),
			version: (
				'version' in info && typeof info.version === 'string' ?
					info.version
				:
					'0.0.0'
			),
		},
		paths: {},
		components: {
			schemas: collectOpenRpcSchemas(document),
		},
	}
}

const downloadSchema = async ({
	manifest,
	schemaFile,
}: {
	manifest: OpenRpcSchemaSource
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
	const document = JSON.parse(await readFile(schemaFile, 'utf8')) as Record<string, unknown>
	const output = await openapiTS(
		openRpcDocumentToOpenApi(document) as Parameters<typeof openapiTS>[0]
	)
	await writeFile(typesFile, astToString(output))
	console.log(`Generated types at ${typesFile}`)
}

const isGeneratable = ({
	schemaFile,
	typesFile,
}: LoadedOpenRpcSchemaSource) => (
	schemaFile != null && typesFile != null
)

const checkTypes = async (loaded: LoadedOpenRpcSchemaSource) => {
	if (!isGeneratable(loaded)) {
		console.log(`Skipping ${relative(sourcesDir, loaded.manifestFile)}: no schemaFile/typesFile`)
		return
	}

	const {
		manifestFile,
		schemaFile,
		typesFile,
	} = loaded
	console.log(`Checking ${relative(sourcesDir, manifestFile)}`)
	const tempDir = await mkdtemp(join(tmpdir(), 'blockhead-openrpc-'))
	const tempTypesFile = join(tempDir, 'openrpc.d.ts')

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
			throw new Error(`${manifestFile}: generated OpenRPC types drift from checked-in ${typesFile}`)
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}
}

export const checkOpenRpcFreshness = async (loaded: LoadedOpenRpcSchemaSource) => {
	if (!isGeneratable(loaded))
		throw new Error(`${loaded.manifestFile}: cannot check schemaDirectory manifest freshness without one comparable schemaFile`)

	console.log(`Checking upstream freshness for ${relative(sourcesDir, loaded.manifestFile)}`)
	const response = await fetch(loaded.manifest.schemaUrl)
	if (!response.ok)
		throw new Error(`Failed to download schema: ${response.status} ${response.statusText}`)

	const upstreamSchema = await response.text()
	if (upstreamSchema !== await readFile(loaded.schemaFile, 'utf8'))
		throw new Error(`${loaded.manifestFile}: OpenRPC schema drifts from official ${loaded.manifest.schemaUrl}`)
}

const syncSchemaSource = async (loaded: LoadedOpenRpcSchemaSource) => {
	if (!isGeneratable(loaded)) {
		console.log(`Skipping ${relative(sourcesDir, loaded.manifestFile)}: no schemaFile/typesFile`)
		return
	}

	const {
		manifest,
		manifestFile,
		schemaFile,
		typesFile,
	} = loaded
	console.log(`Syncing ${relative(sourcesDir, manifestFile)}`)
	await downloadSchema({
		manifest,
		schemaFile,
	})
	await generateTypes({
		schemaFile,
		typesFile,
	})
}

const dryRunSchemaSource = (loaded: LoadedOpenRpcSchemaSource) => {
	const relativeManifest = relative(sourcesDir, loaded.manifestFile)
	if (!isGeneratable(loaded)) {
		console.log(`${relativeManifest}: skip (no schemaFile/typesFile)${loaded.manifest.schemaDirectory != null ? ` schemaDirectory=${loaded.manifest.schemaDirectory}` : ''}`)
		return
	}

	console.log(
		`${relativeManifest}: sync schemaUrl=${loaded.manifest.schemaUrl} schemaFile=${loaded.manifest.schemaFile} typesFile=${loaded.manifest.typesFile}`
	)
}

export const runOpenRpcSources = async (rawArgs = process.argv.slice(2)) => {
	const argv = rawArgs.filter((arg) => arg !== '--')
	const [
		modeOrFilter,
		filterAfterMode,
	] = argv

	if (modeOrFilter === 'help' || modeOrFilter === '--help' || modeOrFilter === '-h') {
		console.log(usage)
		return
	}

	const mode = (
		modeOrFilter === 'check'
		|| modeOrFilter === 'freshness'
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
		else if (mode === 'freshness')
			await checkOpenRpcFreshness(loaded)
		else if (mode === 'generate') {
			if (!isGeneratable(loaded)) {
				console.log(`Skipping ${relative(sourcesDir, manifestFile)}: no schemaFile/typesFile`)
				continue
			}
			console.log(`Generating ${relative(sourcesDir, manifestFile)}`)
			await generateTypes({
				schemaFile: loaded.schemaFile,
				typesFile: loaded.typesFile,
			})
		} else
			await syncSchemaSource(loaded)
	}
}

if (
	process.argv[1] != null
	&& import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
	await runOpenRpcSources()
