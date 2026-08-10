import {
	defaultResolverContextRowLimit,
	fieldLoadedSubsetKey,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION,
} from '$/constants/Persistence.ts'
import {
	BaseQueryBuilder,
	and,
	createCollection,
	eq,
} from '@tanstack/db'
import { stringify } from 'devalue'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
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
import ts from 'typescript'


const srcPath = join(
	process.cwd(),
	'src'
)
const rootPath = process.cwd()

const sourceFiles = (
	directory: string
): string[] => (
	readdirSync(directory, {
		withFileTypes: true,
	})
		.flatMap((entry) => (
			entry.isDirectory() ?
				entry.name.endsWith('_') ?
					[]
				:
					sourceFiles(join(directory, entry.name))
			:
				/\.(?:test|spec)\.ts$/.test(entry.name) ?
					[]
				:
					/\.(?:svelte|ts)$/.test(entry.name) ?
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
const topLevelMarkdownFiles = readdirSync(rootPath)
	.filter((fileName) => fileName.endsWith('.md'))
	.map((fileName) => join(rootPath, fileName))
const sourceRegistryEnumNames = [
	'Source',
	'SourceProvider',
] as const

describe('client resolver architecture', () => {
	it('keeps top-level markdown enum references aligned with source registries', () => {
		const enumValuesByName = {
			Source: new Set(Object.keys(Source)),
			SourceProvider: new Set(Object.keys(SourceProvider)),
		} as const

		for (const filePath of topLevelMarkdownFiles) {
			const markdown = readFileSync(filePath, 'utf8')
			for (const enumName of sourceRegistryEnumNames)
				for (const match of markdown.matchAll(new RegExp(String.raw`\b${enumName}\.([A-Z][A-Za-z0-9_]*)\b`, 'g')))
					expect(enumValuesByName[enumName], `${filePath}: ${enumName}.${match[1]}`).toContain(match[1])
		}
	})

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


	it('keeps product-schema runtime guards out of generic lib', () => {
		expect(scannedSourceFiles.map((filePath) => basename(filePath))).not.toContain('isEntityReferenceWithId.ts')
		expect(scannedSourceFiles.map((filePath) => basename(filePath))).not.toContain('isMarketEntityId.ts')
		expect(scannedSourceFiles.map((filePath) => basename(filePath))).not.toContain('createAction.ts')
		expect(scannedSourceFiles.map((filePath) => basename(filePath))).not.toContain('caip19.ts')
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'eip6963.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'eip1193.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'evm-trace.ts')]).toBeUndefined()
		expect(scannedSource).not.toMatch(/\bevmAbiEntrySignature\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'calldata-decode.ts')]).not.toMatch(/as unknown as Parameters<typeof decodeParameters>\[0\]/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'calldata-decode.ts')]).not.toMatch(/\bformatDecodedParamValue\s*=\s*\(type: string,\s*value: unknown\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'http.ts')]).not.toMatch(/\blet parsed: unknown\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'http.ts')]).not.toMatch(/\bas \{ (?:error|message): unknown \}/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'http.ts')]).not.toMatch(/\bproxyFetch\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'http.ts')]).not.toMatch(/\bresolveCorsEnabled\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'http.ts')]).toMatch(/Unregistered source origin/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'errors.ts')]).not.toMatch(/\bas \{ message: (?:unknown|string) \}/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'html.ts')]).not.toMatch(/\bhtmlToPlainText\s*=\s*\(\w+:\s*unknown\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Primal', 'Rest', 'client.ts')]).not.toMatch(/\bbody:\s*unknown\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Blockscout', 'Rest', 'client.ts')]).not.toMatch(/\bparams:\s*unknown\[\]/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Blockscout', 'Rest', 'queries.ts')]).not.toMatch(/\bwire:\s*unknown\b|\berror\?:\s*unknown\b|as \{ errors?\?: unknown \}/)
		expect(scannedSource).not.toMatch(/\bmergeActionParams\b/)
		expect(scannedSource).not.toMatch(/\$\/lib\/caip19\.ts/)
		expect(scannedSource).not.toMatch(/\$\/lib\/eip6963\.ts/)
		expect(scannedSource).not.toMatch(/\$\/lib\/eip1193\.ts/)
		expect(scannedSource).not.toMatch(/\$\/lib\/evm-trace\.ts/)
		expect(scannedSource).not.toMatch(/\bSlip44\b/)
	})

	it('keeps route construction out of generic signature helpers', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'signature-paths.ts')]).not.toMatch(/\$app\/paths/)
		expect(scannedSource).not.toMatch(/\bgetEvm(?:Selector|Topic|Error)Path\b/)
	})

	it('keeps media entity row construction in resolver ownership', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'media.ts')]).not.toMatch(/\bEntityMetaKey\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'media.ts')]).not.toMatch(/\bmediaFromUrl\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'media.ts')]).toMatch(/\bmediaFromUrl\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'media.ts')]).toMatch(/\bEntityMetaKey\b/)
	})

	it('keeps OHLC source rows and resolver row construction out of generic lib', () => {
		expect(scannedSourceFiles.map((filePath) => basename(filePath))).not.toContain('marketOhlcCandles.ts')

		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			|| path.startsWith(join(srcPath, 'sources'))
		)))
			expect(scannedSourceByFilePath[filePath], filePath).not.toMatch(/\$\/lib\/marketOhlcCandles\.ts/)
	})

	it('keeps nested source metadata barrels out of active source registries', () => {
		const nestedSourceMetadataBarrels = Object.entries(scannedSourceByFilePath).flatMap(([filePath, source]) => {
			const relativePath = filePath.slice(srcPath.length + 1)
			return (
				!relativePath.startsWith('sources/')
				|| basename(filePath) !== 'index.ts'
				|| relativePath.split('/').length <= 3
				|| !/export default \{\s*provider: SourceProvider\./.test(source)
			) ?
				[]
			:
				[relativePath]
		})
		const activeSourceRegistry = [
			scannedSourceByFilePath[join(srcPath, 'sources', 'index.ts')],
			scannedSourceByFilePath[join(srcPath, 'sources', 'index.server.ts')],
		].join('\n')

		expect(nestedSourceMetadataBarrels).toEqual([])
		for (const barrelPath of nestedSourceMetadataBarrels)
			expect(activeSourceRegistry).not.toContain(`$/` + barrelPath)
	})

	it('keeps direct Coin_Timestamp resolvers tied to source clocks', () => {
		for (const filePath of [
			join(srcPath, 'resolvers', 'Blockscout-Rest.ts'),
			join(srcPath, 'resolvers', 'Coingecko-Rest.ts'),
		]) {
			const source = scannedSourceByFilePath[filePath]
			const resolverStart = source.indexOf('entityType: EntityType.Coin_Timestamp')
			expect(resolverStart, filePath).toBeGreaterThanOrEqual(0)
			const resolverSource = source.slice(
				resolverStart,
				source.indexOf('})({', resolverStart)
			)

			expect(resolverSource, filePath).toMatch(/\(\{[^}]*timestampMs:\s*timestampMsSelector/)
			expect(resolverSource, filePath).toMatch(/timestampMs !== timestampMsSelector/)
			expect(resolverSource, filePath).not.toMatch(/\btimestampMs:\s*Date\.now\(\)/)
		}
	})


	it('keeps Ethereum network upgrade constants free of Persisted collection row construction', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'constants', 'EthereumNetworkUpgrades.ts')]

		expect(source).not.toMatch(/\$\/schema\/(?:\$schema|EntityType|index)\.ts/)
		expect(source).not.toMatch(/\bEntity(?:MetaKey|Type)\b/)
		expect(source).not.toMatch(/\bEntity<|typeof schema\b|satisfies Entity\b/)
		expect(source).not.toMatch(/\[\s*EntityMetaKey\.Selector\s*\]/)
		expect(source).not.toMatch(/^export const \w*ChainIds\b/m)
		expect(source).not.toMatch(/\$\$(?:proposals|networkUpgrades)\b/)
		expect(source).not.toMatch(/\$(?:networkExecutionUpgrade|networkConsensusUpgrade)\b/)
	})

	it('keeps market catalog constants domain-shaped', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'constants', 'Market.ts')]

		expect(source).not.toMatch(/\bmarketId\b/)
		expect(source).not.toMatch(/\bMarketIdLabelInput\b/)
		expect(source).not.toMatch(/\bEntityMetaKey\b/)
		expect(source).not.toMatch(/\$(?:base|quote|marketVenue|coin|currency)\b/)
	})


	it('keeps generic lib out of Persisted collection and provider ownership', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'lib'))
			&& !path.endsWith(join('lib', 'db', 'queryResource.svelte.ts'))
			&& !path.endsWith(join('lib', 'svelte', 'RemoteResource.svelte.ts'))
		))) {
			const source = scannedSourceByFilePath[filePath]
			const relativePath = filePath.slice(srcPath.length + 1)

			for (const match of source.matchAll(/from ['"]([^'"]+)['"]/g)) {
				if (match[1].startsWith('$/sources/'))
					expect([
						...(relativePath === 'lib/http.ts' ? [
							'$/sources/SourceBinding.ts',
							'$/sources/SourceProviderDefinition.ts',
						] : []),
					], `${relativePath}: ${match[1]}`).toContain(match[1])
				if (relativePath !== 'lib/media.ts' || match[1] !== '$/constants/IpfsProtocol.ts')
					expect(match[1], relativePath).not.toMatch(/\$\/constants\//)
				expect(match[1], relativePath).not.toMatch(/\$\/resolvers\//)
			}

			expect(source, filePath).not.toMatch(/\bEntityMetaKey\b/)
			expect(source, filePath).not.toMatch(/\$\/schema\/(?:\$schema|EntityType|index)\.ts/)
			expect(source, filePath).not.toMatch(/\bEntity<|typeof schema\b|satisfies Entity\b/)
			expect(source, filePath).not.toMatch(/\[\s*EntityMetaKey\.Selector\s*\]/)
			if (relativePath !== 'lib/virtualRows.ts')
				expect(source, filePath).not.toMatch(/\b(?:singleFlight|cache|cached|memoize|memoized)\b/i)
			if (relativePath !== 'lib/http.ts') {
				expect(source, filePath).not.toMatch(/\b(?:fetch|XMLHttpRequest|EventSource)\s*\(/)
				expect(source, filePath).not.toMatch(/\bnew\s+WebSocket\s*\(/)
			}
		}
	})

	it('keeps Cosmos resolver selector checks structural instead of serialized', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'resolvers', 'CosmosSdk-Rest.ts')]

		expect(source).not.toMatch(/from ['"]devalue['"]/)
		expect(source).not.toMatch(/\bstringify\s*\(\s*network\b/)
	})

	it('keeps ResourceBoundary a pure SvelteKit-shaped await consumer', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'components', 'ResourceBoundary.svelte')]

		expect(source).toMatch(/await resourceRaw/)
		expect(source).toMatch(/<svelte:boundary\b/)
		expect(source).not.toMatch(/\bTanStack/)
		expect(source).not.toMatch(/import\s+Boundary\b/)
		expect(source).not.toMatch(/<Boundary\b/)
		expect(source).not.toMatch(/\bQueryLike\b/)
		expect(source).not.toMatch(/\bRemoteResourceLike\b/)
		expect(source).not.toMatch(/\bSymbol\.toStringTag\b/)
		expect(source).not.toMatch(/\bsubscribeChanges\b/)
		expect(source).not.toMatch(/\bresource(?:Raw)?\.(?:current|ready|loading|error)\b/)
	})

	it('does not retain field-specific resolver definition entry points', () => {
		expect(scannedSource).not.toMatch(/\bdefineEntity(?:Field|FieldCount|Live)?Resolver\b/)
		expect(scannedSource).not.toMatch(/\bexport const useEntity\b/)
		expect(scannedSource).not.toMatch(/\buseEntity\(/)
		expect(scannedSource).not.toMatch(/\buseEntityField(?:Count)?\b/)
		expect(scannedSource).not.toMatch(/\baccepts:\s*\[/)
		expect(scannedSource).not.toMatch(/\bacceptsParent\b/)
		expect(scannedSource).not.toMatch(/\bresolver\.accepts\b/)
		expect(scannedSource).not.toMatch(/\bresolver\.resolve\(/)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'defineResolver.ts')]).not.toMatch(/\bfields:\s*\{\s*\}/)
	})


	it('does not retain legacy Resolver Context compatibility aliases', () => {
		expect(scannedSource).not.toMatch(/\bcontext\.(?:where|orderBy|cursor|limit)\b/)
		expect(scannedSource).not.toMatch(/\bfilters: subsetBase\.filters\b/)
		expect(scannedSource).not.toMatch(/\bsorts: subsetBase\.sorts\b/)
		expect(scannedSource).not.toMatch(new RegExp(`\\bpublicEnv:\\s*${String.fromCharCode(97, 110, 121)}\\b`))
	})

	it('keeps raw TanStack LoadSubsetOptions at parser and collection boundaries', () => {
		for (const filePath of scannedSourceFiles.filter((path) => path.startsWith(join(srcPath, 'resolvers')))) {
			const relativePath = filePath.slice(srcPath.length + 1)
			if (relativePath === 'resolvers/$resolvers.ts')
				continue

			expect(scannedSourceByFilePath[filePath], relativePath).not.toMatch(/\bLoadSubsetOptions\b/)
		}

		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]
		expect(clientSource).not.toMatch(/\bfieldRequest\b/)
		expect(clientSource).not.toMatch(/\brequest:\s*LoadSubsetOptions\s*&/)
		expect(clientSource).not.toMatch(/\bparseResolverSubset\(fieldRequest\)/)
		expect(clientSource).not.toMatch(/\bparseResolverSubset\(request\)/)
		expect(clientSource).toMatch(/\bresolverSnapshot[\s\S]*subset: ReturnType<typeof parseResolverSubset>/)
		expect(clientSource).toMatch(/\bloadEntityRows[\s\S]*loadSubsetOptions: LoadSubsetOptions/)
		expect(clientSource).toMatch(/\bloadFieldRows[\s\S]*loadSubsetOptions: LoadSubsetOptions/)
		expect(clientSource).toMatch(/\bloadCountRows[\s\S]*loadSubsetOptions: LoadSubsetOptions/)
	})

	it('does not retain superseded product read and load surfaces', () => {
		for (const filePath of scannedSourceFiles) {
			const relativePath = filePath.slice(srcPath.length + 1)
			if (
				relativePath.startsWith('routes/test/')
				|| relativePath.endsWith('.e2e.ts')
				|| (
					relativePath.startsWith('sources/')
					&& /\/(?:types|openapi\.d|schema|constants)\.ts$/.test(relativePath)
				)
			)
				continue

			const source = scannedSourceByFilePath[filePath]

			expect(source, relativePath).not.toMatch(/\btype\s+\w*LoadRequest\b/)
			expect(source, relativePath).not.toMatch(/\binterface\s+\w*LoadRequest\b/)
			expect(source, relativePath).not.toMatch(/\bEntitySelectorProjection(?:\.Identity)?\b/)
			expect(source, relativePath).not.toMatch(/\bResolverLoadRequest\b/)
			expect(source, relativePath).not.toMatch(/\bloadResolverRequest\b/)
			expect(source, relativePath).not.toMatch(/\bresolverRequest\b/)
			expect(source, relativePath).not.toMatch(/\buseEntity(?:Field|FieldCount)?\b/)
			expect(source, relativePath).not.toMatch(/\bpreload(?:Entity|Field|Resolver|Product|Collection|Subscribe)\b/)
			expect(source, relativePath).not.toMatch(/\bentityDefinition\.(?:id|identities|lookups)\b/)
		}
	})

	it('keeps route load selector payloads named by the selector contract', () => {
		for (const [filePath, source] of Object.entries(scannedSourceByFilePath)) {
			const relativePath = filePath.slice(srcPath.length + 1)
			if (!relativePath.startsWith('routes/') || !relativePath.endsWith('+page.ts'))
				continue

			expect(source, relativePath).not.toMatch(/\breturn\s+\{\s*entitySelector\b/)
			expect(source, relativePath).not.toMatch(/\bentitySelector:\s*\{/)
		}
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


	it('keeps generated named source selections backed by defaults and valid sources', () => {
		const generatedSourceSelection = readFileSync(join(srcPath, 'sources', 'specificationProposalSources.ts'), 'utf8')

		expect(generatedSourceSelection).toMatch(/export default \(\{/)
		expect(generatedSourceSelection).not.toMatch(/Record<string|SourceSelectionByKey|\.join\(':'\)/)
		expect(
			[...generatedSourceSelection.matchAll(/\bSource\.([A-Z][A-Za-z0-9_]*)\b/g)]
				.map((match) => match[1])
				.filter((source) => !(source in Source))
		).toEqual([])
	})

	it('does not collapse explicit view source selections against field defaults', () => {
		const generatorSource = readFileSync(join(rootPath, 'scripts', 'app', 'generate.ts'), 'utf8')
		const subscribeSource = scannedSourceByFilePath[join(srcPath, 'client', '$subscribe.svelte.ts')]

		expect(generatorSource).not.toMatch(/const fieldQuery(?:ForName)? = /)
		expect(generatorSource).not.toMatch(/const fieldSourceOverride = /)
		expect(subscribeSource).toMatch(/selection\.sources \?\? definition\.defaultSources/)
	})

	it('scopes entity identity and field provenance independently', () => {
		const subscribeSource = scannedSourceByFilePath[join(srcPath, 'client', '$subscribe.svelte.ts')]
		const proxySource = scannedSourceByFilePath[join(srcPath, 'client', '$proxy.svelte.ts')]

		expect(subscribeSource).toMatch(/const selectorSources = selection\.selectorSources \?\? selection\.sources/)
		expect(subscribeSource).toMatch(/enabledSelectionSources\(context, selectorSources\)/)
		expect(proxySource).toMatch(/selectorSources: \[\],[\s\S]*?fields: projectionDependencyFields/)
	})

	it('does not keep false alternate-selector resolver branches', () => {
		const source = [
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

	it('keeps migrated social timestamp resolver branches explicit about selector fields', () => {
		const source = [
			join(srcPath, 'resolvers', 'Atproto-BskySocial-Xrpc.ts'),
			join(srcPath, 'resolvers', 'Atproto-Xrpc.ts'),
			join(srcPath, 'resolvers', 'BskyAppViewXrpc.ts'),
			join(srcPath, 'resolvers', 'Farcaster-Rest.ts'),
			join(srcPath, 'resolvers', 'Reddit-PublicJson.ts'),
			join(srcPath, 'resolvers', 'Reddit-Rest.ts'),
			join(srcPath, 'resolvers', 'X-FxEmbed-Rest.ts'),
			join(srcPath, 'resolvers', 'X-Rest.ts'),
		]
			.map((filePath) => scannedSourceByFilePath[filePath])
			.join('\n')

		expect(source).not.toMatch(/\[(?:AtprotoPost|Farcaster(?:Channel|User)|Reddit(?:Comment|Link|Subreddit)|XPost)Selector\.[^\]]+\]: async \(entitySelector/)
		expect(source).not.toMatch(/\$[a-zA-Z]+:\s*entitySelector\b/)
		expect(source).not.toMatch(/\bget(?:Posts?|Status|Tweet|Info|SubredditAbout|PrimaryAddress|Channel(?:FollowersCount|MembersCount)?)\([^)]*entitySelector\./)
	})

	it('does not register resolver facets that only represent unsupported product surfaces', () => {
		const source = scannedSourceFiles
			.filter((filePath) => (
				filePath.startsWith(join(srcPath, 'resolvers'))
				&& basename(filePath) !== '$resolvers.ts'
				&& basename(filePath) !== 'index.ts'
			))
			.map((filePath) => scannedSourceByFilePath[filePath])
			.join('\n')

		expect(source).not.toMatch(/Constants_Internal: \$+\w+ is (?:unsupported|not implemented)/)
		expect(source).not.toMatch(/throw new Error\('[^']+: \$+\w+ is unsupported;/)
		expect(source).not.toMatch(/\$\$marketsWithCoinAsQuote unsupported/)
		expect(source).not.toMatch(/\$\$marketsWithInstanceAs(?:Base|Quote) is unsupported/)
		expect(source).not.toMatch(/\$\$replies unsupported/)
		expect(source).not.toMatch(/\$\$erc20TokenAllowances unsupported/)
		expect(source).not.toMatch(/\$\$beacon(?:Epochs|Slots|Validators|Committees|SyncCommittees|Attestations|Withdrawals|Slashings) unsupported/)
		expect(source).not.toMatch(/\$\$marketsWithCoinAsBase unsupported for coin/)
		expect(source).not.toMatch(/\$\$coinInstances unsupported for coin/)
		expect(source).not.toMatch(/ERC-4337 user operations not supported/)
	})

	it('keeps count completion explicit through source outcomes', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]

		expect(clientSource).toMatch(/type PersistedCollectionSourceOutcome/)
		expect(clientSource).toMatch(/PersistedCollectionSourceStatus\.Completed/)
		expect(clientSource).toMatch(/PersistedCollectionSourceStatus\.Failed/)
		expect(clientSource).toMatch(/sourceRowCounts\[source\] !== undefined/)
		expect(clientSource).not.toMatch(/\bcompletedSourcesFromResolverEvents\b/)
		expect(clientSource).not.toMatch(/\bcountRows\b/)
	})

	it('keeps parent list resolvers from hiding child scalar payloads', () => {
		const blockscoutSource = scannedSourceByFilePath[join(srcPath, 'resolvers', 'Blockscout-Rest.ts')]
		const blockscoutBlockListResolver = blockscoutSource.slice(
			blockscoutSource.indexOf('const wires = await getBlocks({'),
			blockscoutSource.indexOf('$$blocks: (entity) => entity') + '$$blocks: (entity) => entity'.length
		)
		const blockchairSource = scannedSourceByFilePath[join(srcPath, 'resolvers', 'Blockchair-Rest.ts')]
		const blockchairListResolvers = [
			blockchairSource.slice(
				blockchairSource.indexOf('const { getBlocks } = await import(\'$/sources/Blockchair/Rest/queries.ts\')'),
				blockchairSource.indexOf('$$blocks: (blocks) => blocks') + '$$blocks: (blocks) => blocks'.length
			),
			blockchairSource.slice(
				blockchairSource.indexOf('const { getTransactions } = await import(\'$/sources/Blockchair/Rest/queries.ts\')'),
				blockchairSource.indexOf('$$transactions: (transactions) => transactions') + '$$transactions: (transactions) => transactions'.length
			),
			blockchairSource.slice(
				blockchairSource.indexOf('return dashboard.transactions.map((transaction) => ({'),
				blockchairSource.indexOf('$$transactions: (transactions) => transactions', blockchairSource.indexOf('return dashboard.transactions.map((transaction) => ({')) + '$$transactions: (transactions) => transactions'.length
			),
			blockchairSource.slice(
				blockchairSource.indexOf('return transactionDashboard.inputs.map((input, inputIndex) => ('),
				blockchairSource.indexOf('$$inputs: (inputs) => inputs') + '$$inputs: (inputs) => inputs'.length
			),
			blockchairSource.slice(
				blockchairSource.indexOf('return transactionDashboard.outputs.map((output, outputIndex) => ('),
				blockchairSource.indexOf('$$outputs: (outputs) => outputs') + '$$outputs: (outputs) => outputs'.length
			),
		].join('\n')
		const mempoolSpaceSource = scannedSourceByFilePath[join(srcPath, 'resolvers', 'MempoolSpace-Rest.ts')]
		const mempoolSpaceListResolvers = [
			mempoolSpaceSource.slice(
				mempoolSpaceSource.indexOf('const { getBlocks } = await import(\'$/sources/MempoolSpace/Rest/queries.ts\')'),
				mempoolSpaceSource.indexOf('$$blocks: (blocks) => blocks') + '$$blocks: (blocks) => blocks'.length
			),
			mempoolSpaceSource.slice(
				mempoolSpaceSource.indexOf('const { getMempoolTxids } = await import(\'$/sources/MempoolSpace/Rest/queries.ts\')'),
				mempoolSpaceSource.indexOf('$$transactions: (transactions) => transactions') + '$$transactions: (transactions) => transactions'.length
			),
			mempoolSpaceSource.slice(
				mempoolSpaceSource.indexOf('await getBlockTransactionIds({'),
				mempoolSpaceSource.indexOf('$$transactions: (transactions) => transactions', mempoolSpaceSource.indexOf('await getBlockTransactionIds({')) + '$$transactions: (transactions) => transactions'.length
			),
			mempoolSpaceSource.slice(
				mempoolSpaceSource.indexOf('(await getTransaction(entitySelector)).vin.map((input, inputIndex) => ('),
				mempoolSpaceSource.indexOf('$$inputs: (inputs) => inputs') + '$$inputs: (inputs) => inputs'.length
			),
			mempoolSpaceSource.slice(
				mempoolSpaceSource.indexOf('(await getTransaction(entitySelector)).vout.map((output, outputIndex) => ('),
				mempoolSpaceSource.indexOf('$$outputs: (outputs) => outputs') + '$$outputs: (outputs) => outputs'.length
			),
		].join('\n')
		const atprotoSource = scannedSourceByFilePath[join(srcPath, 'resolvers', 'BskyAppViewXrpc.ts')]
			.split('defineResolver(')
			.filter((resolverBlock) => (
				(
					resolverBlock.includes('entityType: EntityType.AtprotoActor,')
					|| resolverBlock.includes('entityType: EntityType.AtprotoPost,')
				)
				&& resolverBlock.includes('$$timestamps: (timestamps) => timestamps')
			))
			.join('\n')

		expect(blockscoutBlockListResolver).not.toMatch(/\b(?:hash|number|timestamp|gasUsed|gasLimit|baseFeePerGas|transactionCount):/)
		expect(blockchairListResolvers).not.toMatch(/\b(?:version|lockTime|sizeBytes|virtualSizeBytes|weightUnits|feeSats|isCoinbase|scriptSigAsm|sequence|witness|valueSats|scriptPubKeyHex|scriptPubKeyType|isSpent):/)
		expect(mempoolSpaceListResolvers).not.toMatch(/\b(?:timestampMs|merkleRoot|nonce|difficulty|sizeBytes|weightUnits|transactionCount|\$spentOutput|coinbaseScript|scriptSigAsm|sequence|witness|valueSats|scriptPubKeyHex|scriptPubKeyType|\$address):/)
		expect(atprotoSource).not.toMatch(/\$\$timestamps:[\s\S]*\b(?:followersCount|followsCount|postsCount|likeCount|repostCount|replyCount|quoteCount):/)
	})


	it('keeps resolver and source modules free of single-flight caches', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			|| path.startsWith(join(srcPath, 'sources'))
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\bsingleFlight\b/)
			expect(source, filePath).not.toMatch(/\$\/lib\/singleFlight\.ts/)
			expect(source, filePath).not.toMatch(/\b(?:dedupe|memoize|memoized|cached(?!At\b)[A-Z]\w*|cacheOnce|once[A-Z]\w*)\b/)
		}
	})

	it('keeps resolver modules from waterfalling through product read surfaces', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\$\/client\/\$client\.svelte\.ts/)
			expect(source, filePath).not.toMatch(/\b(?:resolveEntity|resolveSnapshot|subscribeEntity)\b/)
			expect(source, filePath).not.toMatch(/\bresolver\.resolve\(/)
		}
	})

	it('keeps resolver facets as synchronous snapshot projection only', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\b(?:select|resolveCount|discriminate):\s*async\b/)
			expect(source, filePath).not.toMatch(/\b(?:select|resolveCount|discriminate):\s*(?:\([^)]*\)|\w+)\s*=>[\s\S]*?\b(?:fetch|corsFetch|getJson|getText)\s*\(/)
		}
	})

	it('keeps Constants_Internal resolvers as checked-in catalog projection only', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'resolvers', 'Constants.ts')]

		expect(source).not.toMatch(/^import\s+(?!type\b)[\s\S]*?from ['"]\$\/sources\/(?!(?:Source|\$sourceProviders)\.ts['"])/m)
		expect(source).not.toMatch(/\$\/sources\/.*\/(?:client|queries|types)\.ts/)
		expect(source).not.toMatch(/\$\/lib\/http\.ts/)
		expect(source).not.toMatch(/\b(?:fetch|XMLHttpRequest|EventSource|corsFetch|getJson|getText)\s*\(/)
		expect(source).not.toMatch(/\bcontext\.publicEnv\b/)
		expect(source).not.toMatch(/\b(?:backfill|enrich|hydrateCatalog|runtimeCatalog)\b/)
	})

	it('keeps checked-in network seeds in Constants_Internal ownership', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== 'Constants.ts'
			&& basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		)))
			expect(scannedSourceByFilePath[filePath], filePath).not.toMatch(/\b\w*NetworkSeed\w*\b/)
	})

	it('keeps transport endpoints in SourceBinding ownership', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		)))
			expect(scannedSourceByFilePath[filePath], filePath).not.toMatch(/\.\w*(?:RpcUrl|RestBaseUrl|ApiBaseUrl|XrpcBase)\b/)
	})


	it('keeps Chainlist source reads owned by the Chainlist resolver', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== 'Chainlist-Rest.ts'
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\$\/sources\/Chainlist\//)
			expect(source, filePath).not.toMatch(/\bfetchRpcsJson\b/)
		}
	})

	it('keeps provider instance caches out of generic lib modules', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'voltaire.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Voltaire', 'JsonRpc', 'provider.ts')]).toBeUndefined()
		for (const filePath of scannedSourceFiles.filter((path) => path.startsWith(join(srcPath, 'lib')))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/@tevm\/voltaire\/provider/)
			expect(source, filePath).not.toMatch(/\bnew Map<string,\s*Provider>\b/)
		}
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'sources'))
			|| path.startsWith(join(srcPath, 'resolvers'))
		)))
			expect(scannedSourceByFilePath[filePath], filePath).not.toMatch(/\bnew Map<string,\s*Provider>\b/)
	})

	it('keeps source env helpers inside source substrate instead of generic lib', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'sources.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'sources', '$sources.ts')]).toMatch(/\bexport const requiredPublicEnvString\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', '$sources.ts')]).toMatch(/\bexport const optionalPublicEnvString\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', '$sources.ts')]).not.toMatch(/\bObject\.getOwnPropertyDescriptor\b/)

		for (const filePath of scannedSourceFiles) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\$\/lib\/sources\.ts/)
		}
	})

	it('uses the canonical resolver context without source-layer aliases', () => {
		expect(scannedSource).not.toMatch(/\bSourceResolverContext\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'defineResolver.ts')]).not.toMatch(/\bSourcePublicEnv\b/)
	})

	it('infers each resolver module source without repeating it in the contract', () => {
		expect(scannedSource).not.toMatch(/RegisteredSourceResolverModule<Source\./)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'defineResolver.ts')]).toMatch(/_Source extends Source = Source/)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'index.ts')]).toMatch(/RegisteredSourceResolverModule<_Source>/)
	})

	it('keeps IPFS source transport details out of generic lib modules', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Ipfs', 'Rest', 'constants.ts')]).toBeDefined()
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'contentType.ts')]).toBeUndefined()
		expect(scannedSource).not.toMatch(/\$\/lib\/contentType\.ts/)
		expect(scannedSource).not.toMatch(new RegExp([
			'Ipfs',
			'Display',
			'Type|Parsed',
			'Ipfs',
			'Content|parse',
			'Ipfs',
			'ContentResponse|',
			'ipfs',
			'Display',
			'TypeFromContent',
		].join('')))

		for (const filePath of scannedSourceFiles.filter((path) => path.startsWith(join(srcPath, 'lib')))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\$\/sources\/Ipfs\/Rest\//)
		}
	})

	it('keeps Swarm source transport details out of ENS content-hash helpers', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'ensContentHash.ts')]).not.toMatch(/\$\/sources\/Swarm\/Rest\//)
	})

	it('keeps Swarm route and presentation helpers out of source transport exports', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'sources', 'Swarm', 'Rest', 'queries.ts')]

		expect(source).not.toMatch(/\bexport const (?:parseBrowseInput|getResourceCanonicalUri|getResourceHref|getResourceAddressFromInput|getResourceAddressFromRouteParams)\b/)
		expect(source).toMatch(/\bexport const fetchBrowseResult\b/)
	})


	it('keeps provider index value imports out of resolver modules', () => {
		const knownProviderIndexValueImportViolations = [
			// TODO: remove entries as resolver modules move provider index values behind source query/runtime ownership.
		]

		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		))) {
			const relativePath = filePath.slice(srcPath.length + 1)
			if (knownProviderIndexValueImportViolations.includes(relativePath))
				continue

			expect(scannedSourceByFilePath[filePath], relativePath).not.toMatch(
				/^import\s+(?!type\b)[\s\S]*?from ['"]\$\/sources\/.*\/index\.ts['"]/m
			)
		}
	})

	it('keeps source bindings, clients, and provider indexes behind resolver-facing queries', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
		))) {
			const relativePath = filePath.slice(srcPath.length + 1)
			const sourceFile = ts.createSourceFile(
				filePath,
				scannedSourceByFilePath[filePath],
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TS
			)
			const valueSourceImports: string[] = []
			const visit = (node: ts.Node) => {
				if (
					ts.isImportDeclaration(node)
					&& !node.importClause?.isTypeOnly
					&& ts.isStringLiteral(node.moduleSpecifier)
				)
					valueSourceImports.push(node.moduleSpecifier.text)

				if (
					ts.isCallExpression(node)
					&& node.expression.kind === ts.SyntaxKind.ImportKeyword
					&& node.arguments.length === 1
					&& ts.isStringLiteral(node.arguments[0])
				)
					valueSourceImports.push(node.arguments[0].text)

				ts.forEachChild(node, visit)
			}
			visit(sourceFile)

			for (const sourceImport of valueSourceImports.filter((sourceImport) => (
				sourceImport.startsWith('$/sources/')
			))) {
				expect(sourceImport, relativePath).not.toMatch(/\/(?:bindings|client|index)\.ts$/)
			}
		}
	})

	it('keeps X and LND runtime credentials out of resolver production code', () => {
		for (const relativePath of [
			'resolvers/LightningLnd-Rest.ts',
			'resolvers/X-Rest.ts',
		]) {
			const filePath = join(srcPath, relativePath)
			const sourceFile = ts.createSourceFile(
				filePath,
				scannedSourceByFilePath[filePath],
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TS
			)
			const credentialReferences: string[] = []
			const visit = (node: ts.Node) => {
				if (
					ts.isIdentifier(node)
					&& (
						node.text === 'publicEnv'
						|| node.text === 'PUBLIC_X_API_BEARER'
						|| node.text === 'PUBLIC_LND_MACAROON_HEX'
						|| node.text === 'X_API_BEARER'
						|| node.text === 'LND_MACAROON_HEX'
					)
				)
					credentialReferences.push(node.text)

				if (
					ts.isStringLiteralLike(node)
					&& (
						node.text === 'PUBLIC_X_API_BEARER'
						|| node.text === 'PUBLIC_LND_MACAROON_HEX'
						|| node.text === 'X_API_BEARER'
						|| node.text === 'LND_MACAROON_HEX'
					)
				)
					credentialReferences.push(node.text)

				ts.forEachChild(node, visit)
			}
			visit(sourceFile)

			expect(credentialReferences, relativePath).toEqual([])
		}
	})

	it('keeps source binding lookup hot paths pre-indexed', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'sources'))
			|| path.startsWith(join(srcPath, 'resolvers'))
		))) {
			const relativePath = filePath.slice(srcPath.length + 1)
			const source = scannedSourceByFilePath[filePath]

			expect(source, relativePath).not.toMatch(/\b\w*Bindings\.find\(\(binding\)/)
			expect(source, relativePath).not.toMatch(/\b\w*Bindings\.find\(\(candidate\)/)
		}
	})

	it('keeps static source support as row-derived lookup maps instead of exported support functions', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'sources'))
			&& basename(path) !== 'SourceBinding.ts'
		))) {
			const relativePath = filePath.slice(srcPath.length + 1)
			const source = scannedSourceByFilePath[filePath]

			expect(source, relativePath).not.toMatch(
				/export const \w*(?:SupportedByChainId|SupportedByNetworkKey)\s*=\s*\(/
			)
		}
	})


	it('keeps source HTTP CORS policy on provider origins instead of source call sites', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'sources'))
			&& basename(path) !== 'SourceBinding.ts'
			&& !path.startsWith(join(srcPath, 'sources', '_runtime'))
			&& !path.endsWith('.d.ts')
			&& !/(?:^|\/)index\.ts$/.test(path)
			&& !/(?:^|\/)constants\.ts$/.test(path)
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\{\s*corsEnabled:/)
			expect(source, filePath).not.toMatch(/\?\s*\{\s*origins:[\s\S]*:\s*\{\s*corsEnabled:/)
			expect(source, filePath).not.toMatch(/\bfetch\s*\(/)
		}
	})


	it('does not expose field-specific count query APIs', () => {
		const queryPipeline = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]

		expect(queryPipeline).not.toMatch(/\bexport const useEntityField(?:Count)?\b/)
	})

	it('does not perform raw collection writes during collection setup', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]

		expect(clientSource).not.toMatch(/\butils\.write(?:Delete|Insert|Update|Batch)\b/)
		expect(clientSource).toMatch(/\butils:\s*entityCollectionUtils\.utils\b/)
		expect(clientSource).toMatch(/\butils:\s*entityFieldCollectionUtils\.utils\b/)
		expect(clientSource).toMatch(/\butils:\s*entityFieldCountCollectionUtils\.utils\b/)
	})

	it('keeps raw collection writes inside collection sync and local mutation boundaries', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]

		expect(clientSource).toMatch(/const persistedCollectionUtils/)
		expect(clientSource).toMatch(/\bwriteRows\(Array\.isArray\(row\) \? row : \[row\]\)/)

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
			expect(viewSource, filePath).not.toMatch(/\((?:parent|network)\.\$\$[A-Za-z0-9_]+ \?\? \[\]\)\.slice\(/)
		}
	})

	it('wires subscribe selection windows into field live-query load subsets', () => {
		const subscribeSource = scannedSourceByFilePath[join(srcPath, 'client', '$subscribe.svelte.ts')]

		expect(subscribeSource).toMatch(/\bcreateLiveQueryCollection\b/)
		expect(subscribeSource).toMatch(/\browsCollection\b/)
		expect(subscribeSource).toMatch(/selection\.limit != null[\s\S]*\.limit\(selection\.limit\)/)
		expect(subscribeSource).toMatch(/selection\.offset != null[\s\S]*\.offset\(selection\.offset\)/)
		expect(subscribeSource).toMatch(/selection\.orderBy/)
		expect(subscribeSource).toMatch(/selection\.where/)
		expect(subscribeSource).toMatch(/\bcountCollection\b/)
		expect(subscribeSource).toMatch(/fieldResourceQueries[\s\S]*selection: SubscribeSelection/)
	})

	it('keeps distinct field loaded-subset keys for different subscribe limits', () => {
		type Row = {
			readonly [EntityMetaKey.ParentSelectorKey]: string
			readonly [EntityMetaKey.Source]: string
			readonly valueKey: string
			readonly valueIndex?: number
		}

		const rows = createCollection<Row, string>({
			id: 'subscribe-architecture.spec.field-rows',
			getKey: (row) => row.valueKey,
			sync: {
				sync: () => {},
			},
		})

		const subsetOptions = (
			limit: number
		) => {
			const query = new BaseQueryBuilder()
				.from({
					row: rows,
				})
				.where(({ row }) => (
					and(
						eq(row[EntityMetaKey.ParentSelectorKey], 'parent-a'),
						eq(row[EntityMetaKey.Source], 'SourceA')
					)
				))
				.orderBy(
					({ row }) => row.valueKey,
					'asc'
				)
				.limit(limit)
			const ir = (query as { _getQuery(): { where?: { expression?: unknown }[], orderBy?: unknown } })._getQuery()
			const where = ir.where?.[0]
			return {
				where: where != null && 'expression' in where ? where.expression : where,
				orderBy: ir.orderBy,
				limit,
			}
		}

		const keys = [
			1,
			2,
		].map((limit) => stringify(fieldLoadedSubsetKey(subsetOptions(limit))))

		expect(keys[0]).not.toBe(keys[1])
	})


	it('keeps views, components, and routes from reading raw Persisted collections', () => {
		for (const filePath of [
			...scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'views'))),
			...scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'components'))),
			...scannedSourceFiles.filter((sourceFilePath) => sourceFilePath.startsWith(join(srcPath, 'routes'))),
		]) {
			const relativePath = filePath.slice(srcPath.length + 1)
			const source = scannedSourceByFilePath[filePath]

			if (
				relativePath !== 'routes/+layout.svelte'
			) {
				expect(source, relativePath).not.toMatch(/\bentityCollectionByEntityType\b/)
				expect(source, relativePath).not.toMatch(/\bentityFieldCollections\b/)
				expect(source, relativePath).not.toMatch(/\bentityFieldCountCollections\b/)
			}
		}
	})

	it('keeps appClient usage limited to debug inspection and sanctioned local mutations', () => {
		const violations: string[] = []

		for (const filePath of scannedSourceFiles) {
			const relativePath = filePath.slice(srcPath.length + 1)
			const source = scannedSourceByFilePath[filePath]
			if (!source.includes('appClient'))
				continue

			if (
				relativePath === 'routes/+layout.svelte'
				|| relativePath.startsWith('routes/test/resource-boundary/')
				|| relativePath.startsWith('routes/test/query-resource-adapter/')
			)
				continue

			if (!/^views\//.test(relativePath))
				violations.push(`${relativePath}: appClient outside sanctioned view/local route`)
			if (!/\$\/collections\/localMutations\.ts/.test(source))
				violations.push(`${relativePath}: appClient without localMutations import`)
			if (/\bappClient\.(?:entityCollections|entityFieldCollections|entityFieldCountCollections|queryClient|loadedSubsets|events|subscribe)\b/.test(source))
				violations.push(`${relativePath}: appClient reaches raw client internals`)
			if (!/\b(?:write|update|delete)Local[A-Za-z0-9_]*\([\s\S]{0,240}\bappClient\b/.test(source))
				violations.push(`${relativePath}: appClient usage is not a local mutation call`)
		}

		expect(violations).toEqual([])
	})

	it('keeps route-local selector bindings aligned with selector props', () => {
		const violations: string[] = []

		for (const filePath of scannedSourceFiles.filter((sourceFilePath) => (
			sourceFilePath.startsWith(join(srcPath, 'routes'))
			&& sourceFilePath.endsWith('.svelte')
		))) {
			const source = scannedSourceByFilePath[filePath]

			if (!/\bentitySelector\b/.test(source))
				continue

			if (/\bselector=\{selector\}/.test(source))
				violations.push(`${filePath}: passes legacy selector prop`)
			if (/\$network:\s*selector\b/.test(source))
				violations.push(`${filePath}: maps route selector as network`)
		}

		expect(violations).toEqual([])
	})


	it('does not present DefiLlama close-price charts as OHLC candles', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'schema', 'Market.ts')]).not.toMatch(
			/name: '\$\$marketTimeIntervalTimestamps'[\s\S]*?defaultSources: \[[^\]]*Source\.Defillama_Rest/
		)
		expect(scannedSourceByFilePath[join(srcPath, 'schema', 'Market_TimeInterval_Timestamp.ts')]).not.toMatch(
			/close: \{[\s\S]*?defaultSources: \[[^\]]*Source\.Defillama_Rest/
		)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'Defillama-Rest.ts')]).not.toMatch(/\b(?:open|high|low|quoteVolume):/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Defillama', 'Rest', 'queries.ts')]).not.toMatch(/\b(?:OhlcCandle|getChartOhlcRows)\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'views', 'Market_TimeInterval_TimestampsView.svelte')] ?? '').not.toMatch(/\bDefiLlama|Defillama\b/)
	})

	it('does not export legacy raw Persisted collection aliases from app layout', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'routes', '+layout.svelte')]).not.toMatch(
			/\bexport const entity(?:CollectionByEntityType|FieldCollections|FieldCountCollections|CollectionsQueryClient)\b/
		)
	})

})
