import { glob, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { generateOutput } from '@gql.tada/cli-utils'

/**
 * Syncs GraphQL sources by scanning for `src/sources/*/Graphql/** /schema-source.ts` manifests.
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

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
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
		(declaration) => !schemaText.includes(declaration),
	)
	return (
		missingDeclarations.length === 0 ?
			schemaText
		:	`${missingDeclarations.join('\n')}\n\n${schemaText}`
	)
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

	const response = await fetch(manifest.schemaUrl)
	if (!response.ok) {
		throw new Error(
			`Failed to download ${sourceModule} schema: ${response.status} ${response.statusText}`,
		)
	}
	await mkdir(dirname(schemaFile), { recursive: true })
	await writeFile(schemaFile, normalizeGraphqlSchemaText(await response.text()))
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
				.join('\n\n'),
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
				'\t',
			),
		)
		await generateOutput({ output: outputFile, tsconfig: tempTsconfigFile })
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}
	console.log(`Generated ${sourceModule} types`)
}

const [filterArg] = process.argv.slice(2).filter((a) => a !== '--')
const modules = await discoverModules(filterArg)
for (const sourceModule of modules) {
	await syncModule(sourceModule)
}
