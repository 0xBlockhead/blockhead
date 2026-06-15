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
const scannedSourceByFilePath = Object.fromEntries(scannedSourceFiles.map((filePath) => [
	filePath,
	readFileSync(filePath, 'utf8'),
]))
const scannedSource = Object.values(scannedSourceByFilePath).join('\n')

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
			const source = scannedSourceByFilePath[filePath]

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
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(broadAnyPattern)
			expect(source, filePath).not.toMatch(anyAnnotationPattern)
		}
	})

	it('does not retain field-specific resolver definition entry points', () => {
		expect(scannedSource).not.toMatch(/\bdefineEntity(?:Field|FieldCount|Live)?Resolver\b/)
		expect(scannedSource).not.toMatch(/\buseEntityField(?:Count)?\b/)
		expect(scannedSource).not.toMatch(/\baccepts:\s*\[/)
		expect(scannedSource).not.toMatch(/\bacceptsParent\b/)
		expect(scannedSource).not.toMatch(/\bresolver\.accepts\b/)
		expect(scannedSource).not.toMatch(/\bresolver\.resolve\(/)
	})

	it('does not retain legacy Resolver Context compatibility aliases', () => {
		expect(scannedSource).not.toMatch(/\bcontext\.(?:filters|sorts|limit)\b/)
		expect(scannedSource).not.toMatch(/\bfilters: subsetBase\.filters\b/)
		expect(scannedSource).not.toMatch(/\bsorts: subsetBase\.sorts\b/)
		expect(scannedSource).not.toMatch(new RegExp(`\\bpublicEnv:\\s*${String.fromCharCode(97, 110, 121)}\\b`))
	})

	it('does not retain private product load request structs', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]

		expect(clientSource).not.toMatch(/\btype\s+\w*LoadRequest\b/)
		expect(clientSource).not.toMatch(/\binterface\s+\w*LoadRequest\b/)
	})

	it('keeps persisted Product Data schema version explicit at the app persistence edge', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]
		const layoutSource = scannedSourceByFilePath[join(srcPath, 'routes', '+layout.svelte')]
		const persistenceSource = scannedSourceByFilePath[join(srcPath, 'constants', 'Persistence.ts')]

		expect(persistenceSource).toMatch(/\bBLOCKHEAD_PRODUCT_DATA_SCHEMA_VERSION\b/)
		expect(clientSource).not.toMatch(/schemaVersion\s*=\s*1/)
		expect(clientSource).toMatch(/schemaVersion:\s*number/)
		expect(layoutSource).toMatch(/\bBLOCKHEAD_PRODUCT_DATA_SCHEMA_VERSION\b/)
		expect(layoutSource).toMatch(/schemaVersion:\s*BLOCKHEAD_PRODUCT_DATA_SCHEMA_VERSION/)
	})

	it('keeps Solana block selector support on explicit selector resolver branches', () => {
		const source = [
			join(srcPath, 'resolvers', 'Solana-JsonRpc.ts'),
			join(srcPath, 'resolvers', 'ThreeXpl-Rest.ts'),
		]
			.map((filePath) => scannedSourceByFilePath[filePath])
			.join('\n')

		expect(source).not.toMatch(/SolanaBlock(?:\.\$\$transactions)? blockHash lookup is unsupported/)
		expect(source).not.toMatch(/\bif \(!\('slot' in entitySelector\)\)/)
		expect(source).not.toMatch(/\[SolanaBlockSelector\.Slot\]: async \(entitySelector\)/)
	})

	it('does not keep false alternate-selector resolver branches', () => {
		const source = [
			join(srcPath, 'resolvers', 'Fedi-Rest.ts'),
			join(srcPath, 'resolvers', 'Mastodon-Rest.ts'),
			join(srcPath, 'resolvers', 'Neynar-Rest.ts'),
			join(srcPath, 'resolvers', 'Lens-Graphql.ts'),
			join(srcPath, 'resolvers', 'Snapchain-Rest.ts'),
			join(srcPath, 'resolvers', 'Constants.ts'),
		]
			.map((filePath) => scannedSourceByFilePath[filePath])
			.join('\n')

		expect(source).not.toMatch(/ActivityPubActor_Timestamp acct lookup is unsupported/)
		expect(source).not.toMatch(/Lens_Graphql: LensAccount\.\$\$posts lookup id is unsupported/)
		expect(source).not.toMatch(/'address' in entitySelector/)
		expect(source).not.toMatch(/Source\.Neynar_Rest[\s\S]*\[FarcasterCastSelector\.UsernameHashPrefix\]/)
		expect(source).not.toMatch(/Source\.Snapchain_Rest[\s\S]*\[FarcasterCastSelector\.Hash\]/)
		expect(source).not.toMatch(/Snapchain_Rest: cast timestamps require cast fid and hash/)
		expect(source).not.toMatch(/'slug' in entitySelector/)
		expect(source).not.toMatch(/networkBySlug\[entitySelector\.slug\]/)
	})

	it('binds every resolver declaration to its module Source', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&&
			basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		))) {
			const source = scannedSourceByFilePath[filePath]
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

	it('keeps resolver and source modules free of single-flight caches', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			|| path.startsWith(join(srcPath, 'sources'))
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\bsingleFlight\b/)
			expect(source, filePath).not.toMatch(/\$\/lib\/singleFlight\.ts/)
		}
	})

	it('keeps provider instance caches out of generic lib modules', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'voltaire.ts')]).toBeUndefined()
		for (const filePath of scannedSourceFiles.filter((path) => path.startsWith(join(srcPath, 'lib')))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/@tevm\/voltaire\/provider/)
			expect(source, filePath).not.toMatch(/\bnew Map<string,\s*Provider>\b/)
		}
	})

	it('keeps source query and constants imports inside resolver resolve functions', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(
				/^import\s+(?!type\b)[\s\S]*?from ['"]\$\/sources\/.*\/(?:queries|constants)\.ts['"]/m,
			)
		}
	})

	it('keeps resolver and source env reads behind source registry and resolver context', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			|| path.startsWith(join(srcPath, 'sources'))
		))) {
			const relativePath = filePath.slice(srcPath.length + 1)
			if (
				relativePath === 'sources/index.ts'
				|| relativePath === 'sources/$sources.ts'
			)
				continue

			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\bimport\.meta\.env\b/)
			expect(source, filePath).not.toMatch(/\$env\/dynamic/)
		}
	})

	it('keeps source HTTP CORS policy on provider origins instead of source call sites', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'sources'))
			&& !/(?:^|\/)index\.ts$/.test(path)
			&& !/(?:^|\/)constants\.ts$/.test(path)
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\{\s*corsEnabled:/)
			expect(source, filePath).not.toMatch(/\?\s*\{\s*origins:[\s\S]*:\s*\{\s*corsEnabled:/)
		}
	})

	it('does not dispatch collection behavior by splitting string collection ids', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]
		const resolverSource = scannedSourceByFilePath[join(srcPath, 'resolvers', '$resolvers.ts')]
		const architectureSource = readFileSync(join(srcPath, 'resolvers', 'subscribe-architecture.spec.ts'), 'utf8')

		expect(clientSource).toContain("kind: 'Entity'")
		expect(clientSource).toContain("kind: 'Field'")
		expect(clientSource).toContain("kind: 'Count'")
		expect(clientSource).not.toContain('resolverPartsKey(')
		expect(clientSource).not.toMatch(/collectionId\s*\.split|\.split\('\\x1E'\)/)
		expect(resolverSource).not.toMatch(/collectionId\s*\.split/)
		expect(architectureSource).not.toMatch(/\.split\('\\x1E'\)/)
	})

	it('does not expose field-specific count query APIs', () => {
		const queryPipeline = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]

		expect(queryPipeline).not.toMatch(/\bexport const useEntityField(?:Count)?\b/)
	})

	it('does not perform raw collection writes during collection setup', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]
		const collectionSetupSource = clientSource.slice(
			clientSource.indexOf('export const createCollections ='),
			clientSource.indexOf('const isDeclarativeFieldOrderBy ='),
		)

		expect(collectionSetupSource).not.toMatch(/\butils\.write(?:Upsert|Delete|Insert|Update|Batch)\b/)
	})

	it('keeps raw collection writes inside live publisher and local mutation boundaries', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]
		const liveWriteSource = clientSource.slice(
			clientSource.indexOf('const replaceFieldRows ='),
			clientSource.indexOf('const parts ='),
		)

		expect(liveWriteSource).toMatch(/\butils\.write(?:Upsert|Delete)\b/)

		for (const filePath of scannedSourceFiles) {
			const source = scannedSourceByFilePath[filePath]
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
			const viewSource = scannedSourceByFilePath[filePath]

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
			const source = scannedSourceByFilePath[filePath]

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
			const source = scannedSourceByFilePath[filePath]

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

	it('keeps route-local selector bindings aligned with selector props', () => {
		for (const filePath of scannedSourceFiles.filter((sourceFilePath) => (
			sourceFilePath.startsWith(join(srcPath, 'routes'))
			&& sourceFilePath.endsWith('.svelte')
		))) {
			const source = scannedSourceByFilePath[filePath]

			if (!/\bentitySelector\b/.test(source))
				continue

			expect(source, filePath).not.toMatch(/\bselector=\{selector\}/)
			expect(source, filePath).not.toMatch(/\$network:\s*selector\b/)
		}
	})

	it('does not export legacy raw Product Data collection aliases from app layout', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'routes', '+layout.svelte')]).not.toMatch(
			/\bexport const entity(?:CollectionByEntityType|FieldCollections|FieldCountCollections|CollectionsQueryClient)\b/,
		)
	})

})
