import { createHash } from 'node:crypto'
import { access, glob, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { generateOutput } from '@gql.tada/cli-utils'
import {
	buildClientSchema,
	buildSchema,
	getIntrospectionQuery,
	printSchema,
	type IntrospectionQuery,
} from 'graphql'

/**
 * Syncs GraphQL sources by scanning provider-local schema manifests.
 *
 * Replication contract:
 * 1. Add schema-source.ts under Graphql, or graphql-schema-source.ts elsewhere.
 * 2. Export schemaSource with schemaUrl OR hash-pinned checkedInSchema,
 *    schemaFile and outputFile. Local input accepts executable SDL or a standard
 *    IntrospectionQuery object (not an MCP/GraphQL response envelope).
 *    schemaName emits an isolated named gql.tada schema without global setup.
 * 3. Run `pnpm run sources:graphql` to sync all, or `-- <SourceModule>` to sync one
 * 4. Run `check` for deterministic checked-in generation and `freshness` for upstream drift
 */
export type GraphqlSchemaSource = {
	schemaName?: string
	schemaFile: string
	outputFile?: string
	patchFile?: string
	verifySchemaFromUrl?: true
} & ({
	schemaUrl: string
	checkedInSchema?: never
} | {
	schemaUrl?: never
	checkedInSchema: { file: string; sha256: string; format: 'sdl' | 'introspection' }
})

const theGraphScalarDeclarations = [
	'scalar BigDecimal',
	'scalar BigInt',
	'scalar Bytes',
	'scalar Int8',
] as const

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export type GraphqlSourceOptions = { rootDir?: string; temporaryDir?: string }
const sourceRoot = (options: GraphqlSourceOptions) => join(options.rootDir ?? rootDir, 'src/sources')
const manifestForModule = async (sourceModule: string, options: GraphqlSourceOptions) => {
	const directory = resolve(sourceRoot(options), sourceModule)
	const explicit = join(directory, 'graphql-schema-source.ts')
	try { await access(explicit); return explicit } catch (error) {
		if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error
		return join(directory, 'schema-source.ts')
	}
}
const pluginSchema = (manifest: GraphqlSchemaSource, schema: string, output: string) =>
	manifest.schemaName == null
		? { schema, tadaOutputLocation: output }
		: { schemas: [{ name: manifest.schemaName, schema, tadaOutputLocation: output }] }

export const discoverModules = async (filter?: string, options: GraphqlSourceOptions = {}): Promise<string[]> => {
	const modules: string[] = []
	for await (const manifestPath of glob(['*/Graphql/**/schema-source.ts', '*/**/graphql-schema-source.ts'], { cwd: sourceRoot(options) })) {
		const sourceModule = dirname(manifestPath)
		if (filter == null || sourceModule === filter) {
			if (!modules.includes(sourceModule)) modules.push(sourceModule)
		}
	}
	if (filter != null && modules.length === 0) {
		throw new Error(`No GraphQL source found matching: ${filter}`)
	}
	return modules.sort()
}

export const normalizeSchemaText = (schemaText: string) => (
	`${schemaText.replace(/[\t ]+$/gm, '').trimEnd()}\n`
)

export const normalizeGraphqlSchemaText = (schemaText: string) => {
	const normalizedSchemaText = normalizeSchemaText(schemaText)
	const missingDeclarations = theGraphScalarDeclarations.filter(
		(declaration) => !normalizedSchemaText.includes(declaration)
	)
	return (
		missingDeclarations.length === 0 ?
			normalizedSchemaText
		:
			`${missingDeclarations.join('\n')}\n\n${normalizedSchemaText}`
	)
}

const readGeneratedOutput = async (outputFile: string) => {
	const output = await readFile(outputFile, 'utf8')
	return output.endsWith('\n') ? output : `${output}\n`
}

const downloadSchemaText = async (
	schemaUrl: string,
	fetchSchema: typeof fetch = fetch
) => {
	const schemaUrlPath = new URL(schemaUrl).pathname.replace(/\/$/, '')
	if (schemaUrlPath.endsWith('/graphql')) {
		const response = await fetchSchema(schemaUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: getIntrospectionQuery(),
			}),
		})
		if (!response.ok) {
			throw new Error(`Failed to download schema: ${response.status} ${response.statusText}`)
		}
		const {
			data,
			errors,
		}: {
			data?: IntrospectionQuery
			errors?: {
				message?: string
			}[]
		} = await response.json()
		if (data == null) {
			throw new Error(
				`Failed to introspect schema: ${
					errors?.[0]?.message ?? 'missing data'
				}`
			)
		}
		return normalizeSchemaText(printSchema(buildClientSchema(data)))
	}

	const response = await fetchSchema(schemaUrl)
	if (!response.ok) {
		throw new Error(`Failed to download schema: ${response.status} ${response.statusText}`)
	}
	return normalizeSchemaText(await response.text())
}

const downloadSchemaSnapshotText = async (
	schemaUrl: string,
	fetchSchema: typeof fetch = fetch
) => {
	const schemaUrlPath = new URL(schemaUrl).pathname.replace(/\/$/, '')
	if (schemaUrlPath.endsWith('/graphql')) {
		const response = await fetchSchema(schemaUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: getIntrospectionQuery(),
			}),
		})
		if (!response.ok)
			throw new Error(`Failed to download schema: ${response.status} ${response.statusText}`)

		return `${JSON.stringify(await response.json(), null, '\t')}\n`
	}

	return normalizeGraphqlSchemaText(await downloadSchemaText(schemaUrl, fetchSchema))
}

export const downloadManifestSchemaText = async (
	manifest: GraphqlSchemaSource,
	fetchSchema: typeof fetch = fetch,
	manifestDirectory = '.'
) => {
	if (manifest.checkedInSchema != null) {
		const input = manifest.checkedInSchema
		const bytes = await readFile(resolve(manifestDirectory, input.file))
		if (createHash('sha256').update(bytes).digest('hex') !== input.sha256)
			throw new Error('Checked-in GraphQL schema digest mismatch')
		const text = bytes.toString('utf8')
		if (input.format === 'sdl') {
			buildSchema(text)
			return text
		}
		const introspection = JSON.parse(text)
		return normalizeSchemaText(printSchema(buildClientSchema(introspection)))
	}
	return (
		manifest.outputFile == null ?
			await downloadSchemaSnapshotText(manifest.schemaUrl, fetchSchema)
		:
			manifest.verifySchemaFromUrl === true ?
				await downloadSchemaText(manifest.schemaUrl, fetchSchema)
			:
				normalizeGraphqlSchemaText(await downloadSchemaText(manifest.schemaUrl, fetchSchema))
	)
}

const syncModule = async (sourceModule: string, options: GraphqlSourceOptions) => {
	const manifestFile = await manifestForModule(sourceModule, options)
	const mod = await import(pathToFileURL(manifestFile).href)
	const manifest = mod.schemaSource as GraphqlSchemaSource | undefined
	if (manifest == null) throw new Error(`Missing \`schemaSource\` export in ${manifestFile}`)

	const schemaFile = resolve(dirname(manifestFile), manifest.schemaFile)
	if (manifest.outputFile == null) {
		await mkdir(dirname(schemaFile), { recursive: true })
		await writeFile(schemaFile, await downloadManifestSchemaText(manifest, fetch, dirname(manifestFile)))
		console.log(`Downloaded ${sourceModule} schema snapshot`)
		return
	}

	const outputFile = resolve(dirname(manifestFile), manifest.outputFile)
	const patchFile =
		manifest.patchFile == null ? undefined : resolve(dirname(manifestFile), manifest.patchFile)

	await mkdir(dirname(schemaFile), { recursive: true })
	await writeFile(
		schemaFile,
		await downloadManifestSchemaText(manifest, fetch, dirname(manifestFile))
	)
	console.log(`Downloaded ${sourceModule} schema`)

	const tempDir = await mkdtemp(join(options.temporaryDir ?? tmpdir(), 'blockhead-graphql-'))
	const tempSchemaFile = join(tempDir, 'schema.graphql')
	const tempTsconfigFile = join(tempDir, 'tsconfig.json')
	try {
		await writeFile(
			tempSchemaFile,
			[
				await readFile(schemaFile, 'utf8'),
				patchFile == null ? undefined : await readFile(patchFile, 'utf8'),
			]
				.filter((part) => part != null)
				.join('\n\n')
		)
		await writeFile(
			tempTsconfigFile,
			JSON.stringify(
				{
					extends: relative(tempDir, resolve(options.rootDir ?? rootDir, 'tsconfig.json')),
					compilerOptions: {
						plugins: [
							{
								name: 'gql.tada/ts-plugin',
								...pluginSchema(manifest, tempSchemaFile, outputFile),
							},
						],
					},
				},
				null,
				'\t'
			)
		)
		await generateOutput({ output: manifest.schemaName == null ? outputFile : undefined, tsconfig: tempTsconfigFile })
		await writeFile(outputFile, await readGeneratedOutput(outputFile))
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}
	console.log(`Generated ${sourceModule} types`)
}

export const checkModule = async (sourceModule: string, options: GraphqlSourceOptions = {}) => {
	console.log(`Checking ${sourceModule}`)
	const manifestFile = await manifestForModule(sourceModule, options)
	const mod = await import(pathToFileURL(manifestFile).href)
	const manifest = mod.schemaSource as GraphqlSchemaSource | undefined
	if (manifest == null) throw new Error(`Missing \`schemaSource\` export in ${manifestFile}`)
	const schemaFile = resolve(dirname(manifestFile), manifest.schemaFile)
	if (manifest.checkedInSchema != null) {
		const captured = await downloadManifestSchemaText(manifest, fetch, dirname(manifestFile))
		if (captured !== await readFile(schemaFile, 'utf8'))
			throw new Error(sourceModule + ': checked-in schema differs from captured input')
	}
	if (manifest.outputFile == null)
		return

	const outputFile = resolve(dirname(manifestFile), manifest.outputFile)
	const patchFile =
		manifest.patchFile == null ? undefined : resolve(dirname(manifestFile), manifest.patchFile)
	const tempDir = await mkdtemp(join(options.temporaryDir ?? tmpdir(), 'blockhead-graphql-'))
	const tempSchemaFile = join(tempDir, 'schema.graphql')
	const tempOutputFile = join(tempDir, 'graphql-env.d.ts')
	const tempTsconfigFile = join(tempDir, 'tsconfig.json')

	try {
		await writeFile(
			tempSchemaFile,
			[
				await readFile(schemaFile, 'utf8'),
				patchFile == null ? undefined : await readFile(patchFile, 'utf8'),
			]
				.filter((part) => part != null)
				.join('\n\n')
		)
		await writeFile(
			tempTsconfigFile,
			JSON.stringify(
				{
					extends: relative(tempDir, resolve(options.rootDir ?? rootDir, 'tsconfig.json')),
					compilerOptions: {
						plugins: [
							{
								name: 'gql.tada/ts-plugin',
								...pluginSchema(manifest, tempSchemaFile, tempOutputFile),
							},
						],
					},
				},
				null,
				'\t'
			)
		)
		await generateOutput({ output: manifest.schemaName == null ? tempOutputFile : undefined, tsconfig: tempTsconfigFile })

		const [
			actual,
			expected,
		] = await Promise.all([
			readGeneratedOutput(tempOutputFile),
			readFile(outputFile, 'utf8'),
		])

		if (actual !== expected)
			throw new Error(`${sourceModule}: generated GraphQL types drift from checked-in ${outputFile}`)
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}
}

export const checkFreshnessModule = async (
	sourceModule: string,
	fetchSchema: typeof fetch = fetch,
	options: GraphqlSourceOptions = {}
) => {
	const manifestFile = await manifestForModule(sourceModule, options)
	const mod = await import(pathToFileURL(manifestFile).href)
	const manifest = mod.schemaSource as GraphqlSchemaSource | undefined
	if (manifest == null) throw new Error(`Missing \`schemaSource\` export in ${manifestFile}`)
	if (manifest.checkedInSchema != null)
		throw new Error(sourceModule + ': checked-in capture has no upstream freshness claim; use check')
	console.log(`Checking upstream freshness for ${sourceModule}`)
	const schemaFile = resolve(dirname(manifestFile), manifest.schemaFile)
	const upstreamSchema = await downloadManifestSchemaText(manifest, fetchSchema)
	if (upstreamSchema !== await readFile(schemaFile, 'utf8'))
		throw new Error(`${sourceModule}: GraphQL schema drifts from official ${manifest.schemaUrl}`)
}

export const runGraphqlSources = async (args: string[], options: GraphqlSourceOptions = {}) => {
	const [
		modeOrFilter,
		filterAfterMode,
	] = args.filter((arg) => arg !== '--')
	const mode = modeOrFilter === 'check' || modeOrFilter === 'freshness' ? modeOrFilter : 'sync'
	const modules = await discoverModules(mode === 'sync' ? modeOrFilter : filterAfterMode, options)
	for (const sourceModule of modules) {
		if (mode === 'check')
			await checkModule(sourceModule, options)
		else if (mode === 'freshness')
			await checkFreshnessModule(sourceModule, fetch, options)
		else
			await syncModule(sourceModule, options)
	}
}

if (
	process.argv[1] != null
	&& import.meta.url === pathToFileURL(resolve(process.argv[1])).href
)
	await runGraphqlSources(process.argv.slice(2))
