import { glob, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { generateOutput } from '@gql.tada/cli-utils'
import {
	buildClientSchema,
	getIntrospectionQuery,
	printSchema,
	type IntrospectionQuery,
} from 'graphql'

/**
 * Syncs GraphQL sources by scanning provider-local schema manifests.
 *
 * Replication contract:
 * 1. Add `schema-source.ts`, `schema.graphql`, `graphql-env.d.ts`, `client.ts`, and `queries.ts`
 * 2. Export `schemaSource` with `schemaUrl`, `schemaFile`, and `outputFile`
 * 3. Run `pnpm run sources:graphql` to sync all, or `-- <SourceModule>` to sync one
 */
type GraphqlSchemaSource = {
	schemaUrl: string
	schemaFile: string
	outputFile: string
	patchFile?: string
}

const theGraphScalarDeclarations = [
	'scalar BigDecimal',
	'scalar BigInt',
	'scalar Bytes',
	'scalar Int8',
] as const

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const sourcesDir = join(rootDir, 'src/sources')

const discoverModules = async (filter?: string): Promise<string[]> => {
	const modules: string[] = []
	for await (const manifestPath of glob('*/Graphql/**/schema-source.ts', { cwd: sourcesDir })) {
		const sourceModule = dirname(manifestPath)
		if (filter == null || sourceModule === filter) {
			modules.push(sourceModule)
		}
	}
	if (filter != null && modules.length === 0) {
		throw new Error(`No GraphQL source found matching: ${filter}`)
	}
	return modules
}

const normalizeGraphqlSchemaText = (schemaText: string) => {
	const missingDeclarations = theGraphScalarDeclarations.filter(
		(declaration) => !schemaText.includes(declaration)
	)
	return (
		missingDeclarations.length === 0 ?
			schemaText
		:
			`${missingDeclarations.join('\n')}\n\n${schemaText}`
	)
}

const readGeneratedOutput = async (outputFile: string) => {
	const output = await readFile(outputFile, 'utf8')
	return output.endsWith('\n') ? output : `${output}\n`
}

const downloadSchemaText = async (schemaUrl: string) => {
	const schemaUrlPath = new URL(schemaUrl).pathname.replace(/\/$/, '')
	if (schemaUrlPath.endsWith('/graphql')) {
		const response = await fetch(schemaUrl, {
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
		return printSchema(buildClientSchema(data))
	}

	const response = await fetch(schemaUrl)
	if (!response.ok) {
		throw new Error(`Failed to download schema: ${response.status} ${response.statusText}`)
	}
	return response.text()
}

const syncModule = async (sourceModule: string) => {
	const manifestFile = resolve(sourcesDir, sourceModule, 'schema-source.ts')
	const mod = await import(pathToFileURL(manifestFile).href)
	const manifest = mod.schemaSource as GraphqlSchemaSource | undefined
	if (manifest == null) throw new Error(`Missing \`schemaSource\` export in ${manifestFile}`)

	const schemaFile = resolve(dirname(manifestFile), manifest.schemaFile)
	const outputFile = resolve(dirname(manifestFile), manifest.outputFile)
	const patchFile =
		manifest.patchFile == null ? undefined : resolve(dirname(manifestFile), manifest.patchFile)

	await mkdir(dirname(schemaFile), { recursive: true })
	await writeFile(schemaFile, normalizeGraphqlSchemaText(await downloadSchemaText(manifest.schemaUrl)))
	console.log(`Downloaded ${sourceModule} schema`)

	const tempDir = await mkdtemp(join(tmpdir(), 'blockhead-graphql-'))
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
					extends: relative(tempDir, resolve(rootDir, 'tsconfig.json')),
					compilerOptions: {
						plugins: [
							{
								name: 'gql.tada/ts-plugin',
								schema: tempSchemaFile,
								tadaOutputLocation: outputFile,
							},
						],
					},
				},
				null,
				'\t'
			)
		)
		await generateOutput({ output: outputFile, tsconfig: tempTsconfigFile })
		await writeFile(outputFile, await readGeneratedOutput(outputFile))
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}
	console.log(`Generated ${sourceModule} types`)
}

const checkModule = async (sourceModule: string) => {
	console.log(`Checking ${sourceModule}`)
	const manifestFile = resolve(sourcesDir, sourceModule, 'schema-source.ts')
	const mod = await import(pathToFileURL(manifestFile).href)
	const manifest = mod.schemaSource as GraphqlSchemaSource | undefined
	if (manifest == null) throw new Error(`Missing \`schemaSource\` export in ${manifestFile}`)

	const schemaFile = resolve(dirname(manifestFile), manifest.schemaFile)
	const outputFile = resolve(dirname(manifestFile), manifest.outputFile)
	const patchFile =
		manifest.patchFile == null ? undefined : resolve(dirname(manifestFile), manifest.patchFile)
	const tempDir = await mkdtemp(join(tmpdir(), 'blockhead-graphql-'))
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
					extends: relative(tempDir, resolve(rootDir, 'tsconfig.json')),
					compilerOptions: {
						plugins: [
							{
								name: 'gql.tada/ts-plugin',
								schema: tempSchemaFile,
								tadaOutputLocation: tempOutputFile,
							},
						],
					},
				},
				null,
				'\t'
			)
		)
		await generateOutput({ output: tempOutputFile, tsconfig: tempTsconfigFile })

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

const [
	modeOrFilter,
	filterAfterMode,
] = process.argv.slice(2).filter((arg) => arg !== '--')
const check = modeOrFilter === 'check'
const modules = await discoverModules(check ? filterAfterMode : modeOrFilter)
for (const sourceModule of modules) {
	if (check)
		await checkModule(sourceModule)
	else
		await syncModule(sourceModule)
}
