import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import openapiTS, { astToString } from 'openapi-typescript'
import swagger2openapi from 'swagger2openapi'
import YAML from 'yaml'

/**
 * Generic runner for provider-local `src/sources/<Provider>/OpenApi/schema-source.ts` manifests.
 *
 * Replication contract:
 * 1. Add `src/sources/<Provider>/OpenApi/schema-source.ts`
 * 2. Export `schemaSource` with `provider`, `schemaUrl`, `schemaFile`, `typesFile`
 * 3. Add package scripts that call this runner with `download`, `generate`, or `sync`
 */
type OpenApiAction = 'download' | 'generate' | 'sync'

type OpenApiSchemaSource = {
	provider: string
	schemaUrl: string
	schemaFile: string
	typesFile: string
}

const rootDir = resolve(
	dirname(fileURLToPath(import.meta.url)),
	'..',
)

const usage = `
Usage:
  pnpm run sources:openapi -- <download|generate|sync> <Provider>

Example:
  pnpm run sources:openapi -- sync Defillama
`.trim()

const isOpenApiAction = (value: string): value is OpenApiAction => (
	value === 'download'
	|| value === 'generate'
	|| value === 'sync'
)

const loadSchemaSource = async (provider: string): Promise<{
	manifest: OpenApiSchemaSource
	manifestFile: string
	schemaFile: string
	typesFile: string
}> => {
	const manifestFile = resolve(
		rootDir,
		`src/sources/${provider}/OpenApi/schema-source.ts`,
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

const parseSchema = async (schemaFile: string) => {
	const schemaText = await readFile(schemaFile, 'utf8')
	const parsedSchema = (
		schemaFile.endsWith('.yaml') || schemaFile.endsWith('.yml') ?
			YAML.parse(schemaText)
		:
			JSON.parse(schemaText)
	)

	return (
		typeof parsedSchema?.swagger === 'string' ?
			(await swagger2openapi.convertObj(parsedSchema, {})).openapi
		:
			parsedSchema
	)
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
		throw new Error(
			`Failed to download ${manifest.provider} schema: ${response.status} ${response.statusText}`,
		)
	}

	await mkdir(dirname(schemaFile), { recursive: true })
	await writeFile(
		schemaFile,
		await response.text(),
	)

	console.log(`Downloaded ${manifest.provider} schema to ${schemaFile}`)
}

const generateTypes = async ({
	manifest,
	schemaFile,
	typesFile,
}: {
	manifest: OpenApiSchemaSource
	schemaFile: string
	typesFile: string
}) => {
	await mkdir(dirname(typesFile), { recursive: true })

	const output = await openapiTS(
		await parseSchema(schemaFile),
	)

	await writeFile(typesFile, astToString(output))

	console.log(`Generated ${manifest.provider} types at ${typesFile}`)
}

const args = process.argv.slice(2)
const [actionArg, provider] = (
	args[0] === '--' ?
		args.slice(1)
	:	args
)

if (
	actionArg == null
	|| provider == null
	|| !isOpenApiAction(actionArg)
) {
	console.error(usage)
	process.exit(1)
}

const { manifest, schemaFile, typesFile } = await loadSchemaSource(provider)

if (actionArg === 'download' || actionArg === 'sync') {
	await downloadSchema({
		manifest,
		schemaFile,
	})
}

if (actionArg === 'generate' || actionArg === 'sync') {
	await generateTypes({
		manifest,
		schemaFile,
		typesFile,
	})
}
