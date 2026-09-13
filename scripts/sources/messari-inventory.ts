import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { type } from 'arktype'
import { Kind, parse, print } from 'graphql'

export const revision = '2711ac91ef119f321f65b339e10a57f9aa74f9d8'
const repository = 'https://github.com/messari/subgraphs'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../research/messari-standardized-subgraphs')
const treeSchema = type({
	sha: 'string',
	truncated: 'boolean',
	tree: type({ path: 'string' }).array(),
})
const indexSchema = type({
	revision: 'string',
	standards: 'string[]',
	protocolSchemas: 'string[]',
	deploymentConfigurations: 'string[]',
})
const deploymentSchema = type({
	'[string]': {
		schema: 'string',
		base: 'string',
		protocol: 'string',
		deployments: {
			'[string]': {
				network: 'string',
				status: 'string',
				versions: {
					schema: 'string',
					subgraph: 'string',
					methodology: 'string',
				},
				services: {
					'[string]': {
						'query-id?': 'string',
						'slug?': 'string',
					},
				},
			},
		},
	},
})

const json = (value: object) => `${JSON.stringify(value, null, '\t')}\n`

/** Parse indexer SDL, not an invented GraphQL query API or flattened entity model. */
export const describeStandard = (path: string, text: string) => {
	const document = parse(text)
	return {
		path,
		sha256: createHash('sha256').update(text).digest('hex'),
		version: text.match(/^# Version:\s*(\S+)/m)?.[1] ?? null,
		entities: document.definitions.flatMap((definition) => (
			definition.kind === Kind.OBJECT_TYPE_DEFINITION || definition.kind === Kind.INTERFACE_TYPE_DEFINITION ?
				[{
					name: definition.name.value,
					kind: definition.kind === Kind.INTERFACE_TYPE_DEFINITION ? 'interface' : 'object',
					internal: definition.name.value.startsWith('_'),
					description: definition.description?.value ?? null,
					interfaces: definition.interfaces?.map(({ name }) => name.value) ?? [],
					fields: definition.fields?.map((field) => ({
						name: field.name.value,
						type: print(field.type),
						description: field.description?.value ?? null,
						directives: field.directives?.map((directive) => print(directive)) ?? [],
					})) ?? [],
				}]
			:
				[]
		)),
		enums: document.definitions.flatMap((definition) => (
			definition.kind === Kind.ENUM_TYPE_DEFINITION ?
				[{
					name: definition.name.value,
					values: definition.values?.map(({ name }) => name.value) ?? [],
				}]
			:
				[]
		)),
	}
}

const download = async (url: string) => {
	const response = await fetch(url, { signal: AbortSignal.timeout(60_000) })
	if (!response.ok)
		throw new Error(`Messari inventory: ${response.status} for ${url}`)

	return response.text()
}

export const run = async (mode: string) => {
	if (!['sync', 'generate', 'check'].includes(mode))
		throw new Error('Usage: node --import tsx scripts/sources/messari-inventory.ts sync|generate|check')

	if (mode === 'sync') {
		const tree = treeSchema.assert(JSON.parse(await download(`https://api.github.com/repos/messari/subgraphs/git/trees/${revision}?recursive=1`)))
		if (tree.truncated || tree.sha !== revision)
			throw new Error('Messari inventory: incomplete or mismatched upstream revision')

		const paths = tree.tree.map(({ path }) => path).sort()
		const index = {
			revision,
			standards: paths.filter((path) => /^schema-[a-z-]+\.graphql$/.test(path)),
			protocolSchemas: paths.filter((path) => path.startsWith('subgraphs/') && path.endsWith('/schema.graphql')),
			deploymentConfigurations: paths.filter((path) => path.endsWith('/configurations.json')),
		}
		if (index.standards.length === 0)
			throw new Error('Messari inventory: no root standards discovered')

		// Download and parse the complete closure before publishing any input.
		const inputPaths = [...index.standards, ...index.protocolSchemas, 'deployment/deployment.json', 'LICENSE']
		const inputs: { path: string, text: string }[] = []
		for (let offset = 0; offset < inputPaths.length; offset += 8)
			inputs.push(...await Promise.all(inputPaths.slice(offset, offset + 8).map(async (path) => ({
				path,
				text: await download(`https://raw.githubusercontent.com/messari/subgraphs/${revision}/${path}`),
			}))))
		for (const input of inputs) {
			if (input.path.endsWith('.graphql'))
				describeStandard(input.path, input.text)
			else if (input.path.endsWith('.json'))
				deploymentSchema.assert(JSON.parse(input.text))
		}
		for (const input of inputs) {
			const target = resolve(root, 'upstream', input.path)
			await mkdir(dirname(target), { recursive: true })
			await writeFile(target, input.text)
		}
		await writeFile(resolve(root, 'upstream/index.json'), json(index))
	}

	const index = indexSchema.assert(JSON.parse(await readFile(resolve(root, 'upstream/index.json'), 'utf8')))
	if (index.revision !== revision || index.standards.some((path) => !/^schema-[a-z-]+\.graphql$/.test(path)))
		throw new Error('Messari inventory: invalid pinned input index')

	const standards = await Promise.all(index.standards.map(async (path) => describeStandard(path, await readFile(resolve(root, 'upstream', path), 'utf8'))))
	const protocolSchemas = await Promise.all(index.protocolSchemas.map(async (path) => describeStandard(path, await readFile(resolve(root, 'upstream', path), 'utf8'))))
	const deploymentText = await readFile(resolve(root, 'upstream/deployment/deployment.json'), 'utf8')
	const protocols = deploymentSchema.assert(JSON.parse(deploymentText))
	const deployments = Object.entries(protocols).flatMap(([key, protocol]) => Object.entries(protocol.deployments).map(([id, deployment]) => ({
		id,
		protocolKey: key,
		protocol: protocol.protocol,
		base: protocol.base,
		schemaFamily: protocol.schema,
		network: deployment.network,
		status: deployment.status,
		versions: deployment.versions,
		services: deployment.services,
	})))
	const inventory = {
		repository,
		revision,
		deploymentSha256: createHash('sha256').update(deploymentText).digest('hex'),
		counts: {
			standards: standards.length,
			publicEntityDefinitions: standards.reduce((count, standard) => count + standard.entities.filter((entity) => !entity.internal).length, 0),
			publicFieldDefinitions: standards.reduce((count, standard) => count + standard.entities.filter((entity) => !entity.internal).reduce((fields, entity) => fields + entity.fields.length, 0), 0),
			protocolSchemas: index.protocolSchemas.length,
			deploymentConfigurationFiles: index.deploymentConfigurations.length,
			protocols: Object.keys(protocols).length,
			deployments: deployments.length,
		},
		standards,
		protocolSchemas,
		deployments,
		// Parsed wire definitions are not claims that custom fields are integrated.
		protocolSchemaPaths: index.protocolSchemas,
		deploymentConfigurationPaths: index.deploymentConfigurations,
	}
	const target = resolve(root, 'inventory.json')
	const output = json(inventory)
	if (mode === 'check') {
		if (await readFile(target, 'utf8') !== output)
			throw new Error('Messari inventory: generated inventory differs; run generate')
	} else
		await writeFile(target, output)

	console.log(JSON.stringify(inventory.counts))
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
	await run(process.argv[2] ?? 'check')
