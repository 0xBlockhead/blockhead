import {
	defaultResolverContextRowLimit,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	describe,
	expect,
	it,
} from 'vitest'
import {
	readFileSync,
	readdirSync,
} from 'node:fs'
import {
	basename,
	join,
} from 'node:path'

import {
	EntityFieldCardinality,
	entityFieldDefinitions,
} from '$/schema/$schema.ts'
import {
	indexResolvers,
} from '$/resolvers/$resolvers.ts'
import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import type { Schema } from '$/schema/$schema.ts'
import { indexSourceProviders } from '$/sources/$sources.ts'


const srcPath = join(
	process.cwd(),
	'src',
)

const sourceFiles = (
	directory: string,
): string[] => (
	readdirSync(directory, {
		withFileTypes: true,
	})
		.flatMap((entry) => (
			entry.isDirectory() ?
				sourceFiles(join(directory, entry.name))
			: /\.(?:test|spec)\.ts$/.test(entry.name) ?
				[]
			: /\.(?:svelte|ts)$/.test(entry.name) ?
				[join(directory, entry.name)]
			:
				[]
		))
)

const scannedSourceFiles = sourceFiles(srcPath)

let resolverRegistry: (
	ReturnType<typeof indexResolvers<Schema, string, ResolverContext>>
	& {
		readonly entityDefinitionByType: Awaited<typeof import('$/schema/index.ts')>['entityDefinitionByType']
	}
) | undefined

const getResolverRegistry = async () => {
	if (resolverRegistry != null)
		return resolverRegistry

	const [
		{ env: publicEnv },
		{ entityDefinitionByType, schema },
		{ resolvers },
		{ sourceProviders },
	] = await Promise.all([
		import('$env/dynamic/public'),
		import('$/schema/index.ts'),
		import('$/resolvers/index.ts'),
		import('$/sources/index.ts'),
	])
	resolverRegistry = {
		...indexResolvers(
		schema,
		resolvers,
		indexSourceProviders(sourceProviders, publicEnv).enabledSources,
		),
		entityDefinitionByType,
	}
	return resolverRegistry
}

describe('client resolver architecture', () => {
	it('exposes only the strict Resolver Context shape to real resolvers', () => {
		expect(resolverContextRowLimit({
			filters: [],
			sorts: [],
			pagination: {
				limit: 7,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).toBe(7)
		expect(resolverContextRowLimit({
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).toBe(defaultResolverContextRowLimit)
	})

	it('keeps substrate files free of concrete app definitions', () => {
		for (const filePath of [
			join(srcPath, 'schema', '$schema.ts'),
			join(srcPath, 'sources', '$sources.ts'),
			join(srcPath, 'resolvers', '$resolvers.ts'),
			join(srcPath, 'client', '$client.svelte.ts'),
		]) {
			const source = readFileSync(filePath, 'utf8')

			expect(source, filePath).not.toMatch(/\$\/schema\/(?:index|EntityType)\.ts/)
			expect(source, filePath).not.toMatch(/\$\/sources\/(?:index|Source)\.ts/)
			expect(source, filePath).not.toMatch(/\$\/resolvers\/index\.ts/)
			expect(source, filePath).not.toMatch(/\$\/routes\//)
		}
	})

	it('keeps public substrate type boundaries free of broad dynamic leaks', () => {
		const broadType = String.fromCharCode(97, 110, 121)
		const broadAnyPattern = new RegExp([
			'Record<string,\\s*',
			broadType,
			'>|ArktypeType<',
			broadType,
			',\\s*',
			broadType,
			'>|Type<',
			broadType,
			',\\s*',
			broadType,
			'>|as\\s+',
			broadType,
			'|as\\s+unknown\\s+as',
		].join(''))
		const anyAnnotationPattern = new RegExp([
			':\\s*',
			broadType,
			'(?:\\W|$)',
		].join(''))
		for (const filePath of [
			join(srcPath, 'schema', '$schema.ts'),
			join(srcPath, 'sources', '$sources.ts'),
			join(srcPath, 'resolvers', '$resolvers.ts'),
			join(srcPath, 'client', '$client.svelte.ts'),
			join(srcPath, 'components', 'ResourceBoundary.svelte'),
			join(srcPath, 'lib', 'db', 'queryResource.svelte.ts'),
		]) {
			const source = readFileSync(filePath, 'utf8')

			expect(source, filePath).not.toMatch(broadAnyPattern)
			expect(source, filePath).not.toMatch(anyAnnotationPattern)
		}
	})

	it('does not retain field-specific resolver definition entry points', () => {
		const source = scannedSourceFiles
			.map((filePath) => readFileSync(filePath, 'utf8'))
			.join('\n')

		expect(source).not.toMatch(/\bdefineEntity(?:Field|FieldCount|Live)?Resolver\b/)
		expect(source).not.toMatch(/\buseEntityField(?:Count)?\b/)
		expect(source).not.toMatch(/\baccepts:\s*\[/)
		expect(source).not.toMatch(/\bacceptsParent\b/)
		expect(source).not.toMatch(/\bresolver\.accepts\b/)
		expect(source).not.toMatch(/\bresolver\.resolve\(/)
	})

	it('does not retain legacy Resolver Context compatibility aliases', () => {
		const source = scannedSourceFiles
			.map((filePath) => readFileSync(filePath, 'utf8'))
			.join('\n')

		expect(source).not.toMatch(/\bcontext\.(?:filters|sorts|limit)\b/)
		expect(source).not.toMatch(/\bfilters: subsetBase\.filters\b/)
		expect(source).not.toMatch(/\bsorts: subsetBase\.sorts\b/)
		expect(source).not.toMatch(new RegExp(`\\bpublicEnv:\\s*${String.fromCharCode(97, 110, 121)}\\b`))
	})

	it('keeps Solana block selector support on explicit selector resolver branches', () => {
		const source = [
			join(srcPath, 'resolvers', 'Solana-JsonRpc.ts'),
			join(srcPath, 'resolvers', 'ThreeXpl-Rest.ts'),
		]
			.map((filePath) => readFileSync(filePath, 'utf8'))
			.join('\n')

		expect(source).not.toMatch(/SolanaBlock(?:\.\$\$transactions)? blockHash lookup is unsupported/)
		expect(source).not.toMatch(/\bif \(!\('slot' in entitySelector\)\)/)
		expect(source).not.toMatch(/\[SolanaBlockSelector\.Slot\]: async \(entitySelector\)/)
	})

	it('binds every resolver declaration to its module Source', () => {
		for (const filePath of sourceFiles(join(srcPath, 'resolvers')).filter((path) => (
			basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		))) {
			const source = readFileSync(filePath, 'utf8')
			const defineResolverCalls = [...source.matchAll(/\bdefineResolver\(/g)]
			if (defineResolverCalls.length === 0)
				continue

			const moduleSource = source.match(/\bsource:\s*Source\.([A-Za-z0-9_]+)/)?.[1]
			expect(moduleSource, filePath).toBeDefined()
			expect(source, filePath).not.toMatch(/\bdefineResolver\(\s*\{/)
			expect([...source.matchAll(/\bdefineResolver\(\s*Source\.([A-Za-z0-9_]+)\s*,/g)].map((match) => match[1])).toEqual(
				Array.from({
					length: defineResolverCalls.length,
				}, () => moduleSource),
			)
			if (source.includes('context.publicEnv'))
				expect(source, filePath).not.toMatch(/\btype ResolverContext\b/)
		}
	})

	it('materializes resolver definitions with primary resolve functions', async () => {
		const { resolverDefinitions } = await getResolverRegistry()

		expect(resolverDefinitions.length).toBeGreaterThan(0)

		for (const resolver of resolverDefinitions) {
			expect(Object.keys(resolver.resolve).length).toBeGreaterThan(0)
			expect(Object.values(resolver.resolve).every((resolve) => typeof resolve === 'function')).toBe(true)
		}
		expect(resolverDefinitions.some((resolver) => Object.keys(resolver.resolve).length > 1)).toBe(true)
	}, 120_000)

	it('materializes value facets with source and entity identity from their resolver', async () => {
		const { resolverValuePartsByEntityTypeAndFieldName } = await getResolverRegistry()

		expect(Object.values(resolverValuePartsByEntityTypeAndFieldName).flat().length).toBeGreaterThan(0)

		for (const part of Object.values(resolverValuePartsByEntityTypeAndFieldName).flat()) {
			expect(part.select).toBeDefined()
			expect(part.resolver.entityType).toBe(part.entityType)
			expect(part.resolver.source).toBe(part.source)
		}
	}, 120_000)

	it('only registers count resolvers for multiple-cardinality fields', async () => {
		const {
			entityDefinitionByType,
			resolverCountPartsByEntityTypeAndFieldName,
		} = await getResolverRegistry()

		for (const parts of Object.values(resolverCountPartsByEntityTypeAndFieldName)) {
			expect(parts.length).toBeGreaterThan(0)
			expect([
				EntityFieldCardinality.Many,
				EntityFieldCardinality.ZeroOrMany,
			]).toContain(
				entityFieldDefinitions(entityDefinitionByType[parts[0].entityType]).find((field) => (
					field.name === parts[0].fieldName
				))?.cardinality,
			)
		}
	}, 120_000)

	it('materializes resolver parts with typed entity and field identity', async () => {
		const { resolverParts } = await getResolverRegistry()

		expect(resolverParts.length).toBeGreaterThan(0)
		expect(resolverParts.every((part) => part.entityType.length > 0 && part.fieldName.length > 0)).toBe(true)
	}, 120_000)

	it('does not dispatch collection behavior by splitting string collection ids', () => {
		const clientSource = readFileSync(
			join(srcPath, 'client', '$client.svelte.ts'),
			'utf8',
		)
		const resolverSource = readFileSync(
			join(srcPath, 'resolvers', '$resolvers.ts'),
			'utf8',
		)
		const architectureSource = readFileSync(
			join(srcPath, 'resolvers', 'subscribe-architecture.spec.ts'),
			'utf8',
		)

		expect(clientSource).toContain("kind: 'Entity'")
		expect(clientSource).toContain("kind: 'Field'")
		expect(clientSource).toContain("kind: 'Count'")
		expect(clientSource).not.toContain('resolverPartsKey(')
		expect(clientSource).not.toMatch(/collectionId\s*\.split|\.split\('\\x1E'\)/)
		expect(resolverSource).not.toMatch(/collectionId\s*\.split/)
		expect(architectureSource).not.toMatch(/\.split\('\\x1E'\)/)
	})

	it('does not expose field-specific count query APIs', () => {
		const queryPipeline = readFileSync(
			join(srcPath, 'client', '$client.svelte.ts'),
			'utf8',
		)

		expect(queryPipeline).not.toMatch(/\bexport const useEntityField(?:Count)?\b/)
	})

	it('does not perform raw collection writes during collection setup', () => {
		const clientSource = readFileSync(
			join(srcPath, 'client', '$client.svelte.ts'),
			'utf8',
		)
		const collectionSetupSource = clientSource.slice(
			clientSource.indexOf('export const createCollections ='),
			clientSource.indexOf('const isDeclarativeFieldOrderBy ='),
		)

		expect(collectionSetupSource).not.toMatch(/\butils\.write(?:Upsert|Delete|Insert|Update|Batch)\b/)
	})

	it('keeps raw collection writes inside live publisher and local mutation boundaries', () => {
		const clientSource = readFileSync(
			join(srcPath, 'client', '$client.svelte.ts'),
			'utf8',
		)
		const liveWriteSource = clientSource.slice(
			clientSource.indexOf('const replaceFieldRows ='),
			clientSource.indexOf('const parts ='),
		)

		expect(liveWriteSource).toMatch(/\butils\.write(?:Upsert|Delete)\b/)

		for (const filePath of scannedSourceFiles) {
			const source = readFileSync(filePath, 'utf8')
			if (!/\butils\.write(?:Upsert|Delete)\b|\b(?:entityCollectionByEntityType|entityFieldCollections|entityFieldCountCollections)\b[\s\S]{0,120}\.delete\(/.test(source))
				continue

			expect([
				join(srcPath, 'client', '$client.svelte.ts'),
				join(srcPath, 'collections', 'localMutations.ts'),
			], filePath).toContain(filePath)
		}
	})

	it('keeps entity-list membership and windowing inside subscribe selection load options', () => {
		for (const filePath of scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'views')))) {
			const viewSource = readFileSync(filePath, 'utf8')

			expect(viewSource, filePath).not.toMatch(/\.slice\(0, limit\)/)
			expect(viewSource, filePath).not.toMatch(/\((?:parent|network)\[entityFieldReference\.fieldName\] \?\? \[\]\)\.slice\(/)
			expect(viewSource, filePath).not.toMatch(/\[\.\.\.\((?:parent|network)\[entityFieldReference\.fieldName\] \?\? \[\]\)\]\s*\.slice\(/)
			expect(viewSource, filePath).not.toMatch(/\((?:parent|network)\.\$\$[A-Za-z0-9_]+ \?\? \[\]\)\.slice\(/)
			expect(viewSource, filePath).not.toMatch(/fields\[entityFieldReference\.fieldName\]\?\.values[\s\S]{0,1000}\.findIndex\(/)
		}
	})

	it('keeps views, components, and routes from importing resolver/source internals', () => {
		for (const filePath of [
			...scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'views'))),
			...scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'components'))),
			...scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'routes'))),
		]) {
			const relativePath = filePath.slice(srcPath.length + 1)
			const source = readFileSync(filePath, 'utf8')

			if (
				relativePath !== 'routes/+layout.svelte'
				&& relativePath !== 'routes/~/(manage)/manage/data/+page.svelte'
				&& !relativePath.startsWith('routes/api/e2e/assert-loaded-resolvers/')
			) {
				expect(source, relativePath).not.toMatch(/\$\/resolvers\//)
				expect(source, relativePath).not.toMatch(/\$\/sources\/(?!Source\.ts)/)
				expect(source, relativePath).not.toMatch(/\buseLiveQuery\(/)
				expect(source, relativePath).not.toMatch(/\bcreateLiveQueryCollection\(/)
			}
		}
	})

	it('keeps views, components, and routes from reading raw Product Data collections', () => {
		for (const filePath of [
			...scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'views'))),
			...scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'components'))),
			...scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'routes'))),
		]) {
			const relativePath = filePath.slice(srcPath.length + 1)
			const source = readFileSync(filePath, 'utf8')

			if (
				relativePath !== 'routes/+layout.svelte'
				&& relativePath !== 'routes/~/(manage)/manage/data/+page.svelte'
			) {
				expect(source, relativePath).not.toMatch(/\bentityCollectionByEntityType\b/)
				expect(source, relativePath).not.toMatch(/\bentityFieldCollections\b/)
				expect(source, relativePath).not.toMatch(/\bentityFieldCountCollections\b/)
			}
		}
	})

	it('keeps conditional and live resolver registration explicit in the real registry', async () => {
		const {
			resolverDiscriminatorPartsByEntityTypeAndConditionKey,
			resolverLivePartsByEntityTypeAndFieldName,
			resolverRootLivePartsByEntityType,
		} = await getResolverRegistry()

		expect(Object.values(resolverDiscriminatorPartsByEntityTypeAndConditionKey).flat().length).toBeGreaterThan(0)
		expect(
			Object.values(resolverLivePartsByEntityTypeAndFieldName).flat().length
			+ Object.values(resolverRootLivePartsByEntityType).flat().length,
		).toBeGreaterThan(0)
	}, 120_000)
})
