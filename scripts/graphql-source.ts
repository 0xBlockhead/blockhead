import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { generateOutput } from '@gql.tada/cli-utils'

/**
 * Generic runner for provider-local `src/sources/<Provider>/Graphql/.../schema-source.ts` manifests.
 *
 * Replication contract:
 * 1. Add `schema-source.ts`, `schema.graphql`, `graphql-env.d.ts`, `client.ts`, and `queries.ts`
 * 2. Export `schemaSource` with `sourceModule`, `schemaUrl`, `schemaFile`, and `outputFile`
 * 3. Add package scripts that call this runner with `download`, `generate`, or `sync`
 */
type GraphqlAction = 'download' | 'generate' | 'sync'

type GraphqlSchemaSource = {
	sourceModule: string
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

const rootDir = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'..',
)

const usage = `
Usage:
  pnpm run sources:graphql -- <download|generate|sync> <SourceModule>

Example:
  pnpm run sources:graphql -- sync TheGraph/Graphql/Ens
`.trim()

const isGraphqlAction = (value: string): value is GraphqlAction => (
	value === 'download'
	|| value === 'generate'
	|| value === 'sync'
)

const loadSchemaSource = async (sourceModule: string): Promise<{
	manifest: GraphqlSchemaSource
	manifestFile: string
	schemaFile: string
	outputFile: string
	patchFile: string | undefined
}> => {
	const manifestFile = resolve(
		rootDir,
		`src/sources/${sourceModule}/schema-source.ts`,
	)
	const module = await import(pathToFileURL(manifestFile).href)
	const manifest = module.schemaSource as GraphqlSchemaSource | undefined

	if (manifest == null) {
		throw new Error(`Missing \`schemaSource\` export in ${manifestFile}`)
	}

	return {
		manifest,
		manifestFile,
		schemaFile: resolve(dirname(manifestFile), manifest.schemaFile),
		outputFile: resolve(dirname(manifestFile), manifest.outputFile),
		patchFile:
			manifest.patchFile == null ?
				undefined
			:	resolve(dirname(manifestFile), manifest.patchFile),
	}
}

const normalizeGraphqlSchemaText = (schemaText: string) => {
	const missingDeclarations = theGraphScalarDeclarations.filter((declaration) => (
		!schemaText.includes(declaration)
	))

	return (
		missingDeclarations.length === 0 ?
			schemaText
		:	`${missingDeclarations.join('\n')}\n\n${schemaText}`
	)
}

const downloadSchema = async ({
	manifest,
	schemaFile,
}: {
	manifest: GraphqlSchemaSource
	schemaFile: string
}) => {
	const response = await fetch(manifest.schemaUrl)

	if (!response.ok) {
		throw new Error(
			`Failed to download ${manifest.sourceModule} schema: ${response.status} ${response.statusText}`,
		)
	}

	await mkdir(dirname(schemaFile), { recursive: true })
	await writeFile(
		schemaFile,
		normalizeGraphqlSchemaText(
			await response.text(),
		),
	)

	console.log(`Downloaded ${manifest.sourceModule} schema to ${schemaFile}`)
}

const generateTypes = async ({
	schemaFile,
	outputFile,
	patchFile,
}: {
	schemaFile: string
	outputFile: string
	patchFile?: string
}) => {
	await mkdir(dirname(outputFile), { recursive: true })

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

		await generateOutput({
			output: outputFile,
			tsconfig: tempTsconfigFile,
		})
	} finally {
		await rm(tempDir, { recursive: true, force: true })
	}

	console.log(`Generated GraphQL types at ${outputFile}`)
}

const args = process.argv.slice(2)
const [actionArg, sourceModule] = (
	args[0] === '--' ?
		args.slice(1)
	:	args
)

if (
	actionArg == null
	|| sourceModule == null
	|| !isGraphqlAction(actionArg)
) {
	console.error(usage)
	process.exit(1)
}

const { manifest, schemaFile, outputFile, patchFile } = await loadSchemaSource(sourceModule)

if (actionArg === 'download' || actionArg === 'sync') {
	await downloadSchema({
		manifest,
		schemaFile,
	})
}

if (actionArg === 'generate' || actionArg === 'sync') {
	await generateTypes({
		schemaFile,
		outputFile,
		patchFile,
	})
}
