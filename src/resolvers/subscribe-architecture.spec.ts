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

	it('keeps substrate files free of concrete app definitions', () => {
		const substrateImportsByFilePath = {
			[join(srcPath, 'schema', '$schema.ts')]: [
				'arktype',
				'devalue',
			],
			[join(srcPath, 'sources', '$sources.ts')]: [
				'arktype',
				'$/sources/SourceBinding.ts',
			],
			[join(srcPath, 'resolvers', '$resolvers.ts')]: [
				'@tanstack/db',
				'@tanstack/query-core',
				'$/schema/$schema.ts',
				'$/sources/$sources.ts',
			],
			[join(srcPath, 'client', '$client.svelte.ts')]: [
				'@tanstack/query-core',
				'@tanstack/db',
				'@tanstack/query-db-collection',
				'@tanstack/db-sqlite-persistence-core',
				'arktype',
				'devalue',
				'svelte',
				'svelte/reactivity',
				'$/schema/$schema.ts',
				'$/resolvers/$resolvers.ts',
				'$/sources/$sources.ts',
				'$/client/$subscribe.svelte.ts',
				'$/client/$proxy.svelte.ts',
			],
		} as const

		for (const [filePath, allowedImports] of Object.entries(substrateImportsByFilePath)) {
			const source = scannedSourceByFilePath[filePath]

			for (const match of source.matchAll(/from ['"]([^'"]+)['"]/g))
				expect(allowedImports, `${filePath}: ${match[1]}`).toContain(match[1])

			expect(source, filePath).not.toMatch(/\b(?:EntityType|Source)\.[A-Za-z0-9_]+\b/)
			expect(source, filePath).not.toMatch(/\$\/(?:constants|views|components|routes|collections)\//)
			expect(source, filePath).not.toMatch(new RegExp(String.raw`\$\/sources\/(?!(?:\$sources|SourceBinding)\.ts)`))
			expect(source, filePath).not.toMatch(new RegExp(String.raw`\$\/resolvers\/(?!\$resolvers\.ts)`))
			expect(source, filePath).not.toMatch(new RegExp(String.raw`\$\/schema\/(?!\$schema\.ts)`))
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
		const anyGenericDefaultPattern = new RegExp([
			'=\\s*',
			broadType,
			'\\b',
		].join(''))
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]

		expect(clientSource).not.toMatch(/\bas EntityFieldResolvedValue\b/)
		expect(clientSource).not.toMatch(/\blet value: EntityFieldResolvedValue\b/)
		expect(clientSource).not.toMatch(/\bfieldSelector\.select\?\.\(/)
		expect(clientSource).not.toMatch(/\bparse\(String\([^)]*filterKey/)
		expect(clientSource).not.toMatch(/\bas\s+(?:never|unknown|unknown\s+as)\b/)

		for (const filePath of [
			join(srcPath, 'schema', '$schema.ts'),
			join(srcPath, 'sources', '$sources.ts'),
			join(srcPath, 'resolvers', '$resolvers.ts'),
			join(srcPath, 'client', '$client.svelte.ts'),
		]) {
			const source = scannedSourceByFilePath[filePath]
			expect(source, filePath).not.toMatch(broadAnyPattern)
			expect(source, filePath).not.toMatch(anyAnnotationPattern)
			expect(source, filePath).not.toMatch(anyGenericDefaultPattern)
			expect(source, filePath).not.toMatch(/\bas\s+(?:never|unknown|unknown\s+as)\b/)
		}

		expect(scannedSourceByFilePath[join(srcPath, 'schema', '$schema.ts')].match(/\b(?:value: unknown|Record<string, unknown>|Partial<Record<string, unknown>>|\[.+\]: unknown|\(value: unknown\) => unknown|_Value = unknown)\b/g)).toHaveLength(8)
		expect(scannedSourceByFilePath[join(srcPath, 'schema', '$schema.ts')]).not.toMatch(/\bany\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', '$resolvers.ts')].match(/:\s*unknown\b/g)).toHaveLength(4)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', '$sources.ts')]).not.toMatch(/\b(?:unknown|any)\b/)
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

	it('keeps migrated social seed constants domain-shaped', () => {
		for (const filePath of [
			join(srcPath, 'constants', 'Social', 'ActivityPub.ts'),
			join(srcPath, 'constants', 'Social', 'Atproto.ts'),
			join(srcPath, 'constants', 'Social', 'Farcaster.ts'),
			join(srcPath, 'constants', 'Social', 'Lens.ts'),
			join(srcPath, 'constants', 'Social', 'Nostr.ts'),
			join(srcPath, 'constants', 'Social', 'Reddit.ts'),
			join(srcPath, 'constants', 'Social', 'Rss.ts'),
			join(srcPath, 'constants', 'Social', 'X.ts'),
			join(srcPath, 'constants', 'Social', 'Xmtp.ts'),
			join(srcPath, 'constants', 'Social', 'YouTube.ts'),
		]) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\$\/schema\/(?:\$schema|EntityType|index)\.ts/)
			expect(source, filePath).not.toMatch(/\bEntity(?:MetaKey|Selector|Type)\b/)
			expect(source, filePath).not.toMatch(/\b\w*NetworkFieldValues\b/)
			expect(source, filePath).not.toMatch(/\b\w*ProtocolFieldValues\b/)
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
		const source = scannedSourceByFilePath[join(srcPath, 'constants', 'MarketCatalog.ts')]

		expect(source).not.toMatch(/\bmarketId\b/)
		expect(source).not.toMatch(/\bMarketIdLabelInput\b/)
		expect(source).not.toMatch(/\bEntityMetaKey\b/)
		expect(source).not.toMatch(/\$(?:base|quote|marketVenue|coin|currency)\b/)
	})

	it('keeps constants as checked-in domain rows and derived row lookups', () => {
		expect(scannedSource).not.toMatch(/\b(?:liquidNetworkId|lightningNetworkId)\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'AtprotoAppView.ts')]).not.toMatch(/^export const \w*(?:Origin|XrpcBase)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Social', 'Atproto.ts')]).not.toMatch(/^export const (?!\w*By)\w*(?:Did|Uri|Url|Id)\s*=/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'BitcoinNetwork.ts')]).not.toMatch(/^export const \w*(?:Caip2|DefaultLocalRpcUrl|RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'CosmosNetwork.ts')]).not.toMatch(/^export const \w*(?:Caip2|RpcUrl|RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'ElementsNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'ExecutionRpcOrigins.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'EthereumSpecs.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'FilecoinNetwork.ts')]).not.toMatch(/^export const \w*(?:Caip2|RpcUrl|RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Mastodon.ts')]).not.toMatch(/^export const \w*(?:Default|Origin|ApiBase)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'MevRelayHosts.ts')]).not.toMatch(/^export const \w*(?:Origin|Origins)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Cashu.ts')]).not.toMatch(/^export const \w*(?:Url|Id)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'Beacon-Rest.ts')]).not.toMatch(/\bbeaconRestBaseByExecutionChainId\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Ens.ts')]).not.toMatch(/^export const ens(?:General|Social|Media)TextRecordKeys\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Ens.ts')]).not.toMatch(/^export const ensTextRecordDisplayOrder\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Ens.ts')]).not.toMatch(/^export const ens(?:TextRecordKeys|CoinTypeIdsToResolve|ProfileTextRecordKeys)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Ens.ts')]).toMatch(/export const ensTextRecords = \[/)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Ens.ts')]).toMatch(/export const ensCoinTypes = \[/)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Ens.ts')]).toMatch(/export const ensTextRecordDisplayRank = Object\.fromEntries\(\s*\n\s*ensTextRecords\.flatMap/)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'HyperliquidNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'LightningNetwork.ts')]).not.toMatch(/^export const \w*(?:RestBaseUrl|RpcUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'MoneroNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'NearNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'PolkadotNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'data', 'precompiles', 'load.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'precompiles', 'index.ts')]).not.toMatch(/\$\/data\/precompiles\/load\.ts/)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'SpecificationProposal.ts')]).not.toMatch(/^export const \w*Ids\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'SolanaNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'TronNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'QuilibriumNetwork.ts')]).not.toMatch(/\bquilibriumDocsEndpoints\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'ZeroGNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Network.ts')]).not.toMatch(/\bnetworkResourceUrlsByNetworkSlug\b/)
		expect(scannedSource).not.toMatch(/\bcatalogSpotMarketsWithCurrencyAsQuote\b/)

		for (const filePath of scannedSourceFiles.filter((path) => path.startsWith(join(srcPath, 'constants')))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/^export const \w*Endpoints\b[\s\S]*?\burl:\s*string\b[\s\S]*?\btransportType:\s*TransportType\b/m)
			expect(source, filePath).not.toMatch(/^export const \w*Endpoints\b[\s\S]*?\b(?:url|restBaseUrl|rpcUrl):\s*string\b/m)
			expect(source, filePath).not.toMatch(/\bimport\.meta\.glob\b/)
			expect(source, filePath).not.toMatch(/\$\/data\/.*\/load\.ts/)
			expect(source, filePath).not.toMatch(/\bserviceProvider:\s*ExecutionRpcProvider\b/)
			expect(source, filePath).not.toMatch(/from ['"]\$\/constants\/ExecutionRpcProvider\.ts['"]/)
			expect(source, filePath).not.toMatch(/^export\s+(?:async\s+)?function\b/m)
			expect(source, filePath).not.toMatch(/^export const \w+\s*=\s*async\b/m)
			expect(source, filePath).not.toMatch(/^export const (?!\w*By)\w*(?:ChainId|AssetId|BlockHeight)\b/m)
			expect(source, filePath).not.toMatch(/^export\s+(?:class|let|var)\b/m)
			expect(source, filePath).not.toMatch(/^export const \w+\s*=\s*new\s+(?:Map|Set|WeakMap|WeakSet)\b/m)
			expect(source, filePath).not.toMatch(/\b(?:singleFlight|cache|cached|memoize|memoized)\b/i)
			expect(source, filePath).not.toMatch(/\b(?:fetch|XMLHttpRequest|EventSource)\s*\(/)
			expect(source, filePath).not.toMatch(/\bnew\s+WebSocket\s*\(/)
			expect(source, filePath).not.toMatch(/\bimport\.meta\.env\b|\$env\//)
			expect(source, filePath).not.toMatch(/\$\/(?:sources|resolvers)\//)
			expect(source, filePath).not.toMatch(/\$\/schema\/(?:\$schema|EntityType|index)\.ts/)
			expect(source, filePath).not.toMatch(/\bEntity(?:MetaKey|Selector|Type)\b/)
			expect(source, filePath).not.toMatch(/\bEntity<|typeof schema\b|satisfies Entity\b/)
			expect(source, filePath).not.toMatch(/\[\s*EntityMetaKey\.Selector\s*\]/)
		}

		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'ExecutionEndpoints.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'Constants.ts')]).not.toMatch(/\bexecutionEndpoints(?:ByChainId)?\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Evm', 'JsonRpc', 'client.ts')]).not.toMatch(/\$\/constants\/ExecutionEndpoints\.ts/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Evm', 'JsonRpc', 'client.ts')]).not.toMatch(/\$\/sources\/Voltaire\//)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Evm', 'JsonRpc', 'client.ts')]).toMatch(/\borigins:\s*readonly SourceOrigin\[\]/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Voltaire', 'index.ts')]).toMatch(/\$\/sources\/Voltaire\/bindings\.ts/)
	})

	it('keeps e2e route fixtures tied to checked-in source seed rows', () => {
		const routeParamFixtureSource = readFileSync(join(rootPath, 'tests', 'e2e', '_routeParamFixtures.ts'), 'utf8')
		const dynamicRouteRealSourcesSource = readFileSync(join(rootPath, 'tests', 'e2e', 'dynamic-route-real-sources.e2e.ts'), 'utf8')

		expect(routeParamFixtureSource).toMatch(/from '\.\.\/\.\.\/src\/constants\/Social\/ActivityPub\.ts'/)
		expect(routeParamFixtureSource).toMatch(/from '\.\.\/\.\.\/src\/constants\/Social\/Atproto\.ts'/)
		expect(routeParamFixtureSource).toMatch(/from '\.\.\/\.\.\/src\/constants\/Social\/Nostr\.ts'/)
		expect(routeParamFixtureSource).toMatch(/from '\.\.\/\.\.\/src\/constants\/Social\/Rss\.ts'/)
		expect(routeParamFixtureSource).toMatch(/from '\.\.\/\.\.\/src\/constants\/Social\/YouTube\.ts'/)
		expect(routeParamFixtureSource).toMatch(/const NOSTR_PROBE_PUBKEY = nostrNetworkSeedProfiles\[0\]\.pubkey/)
		expect(routeParamFixtureSource).toMatch(/const NOSTR_PROBE_RELAY_URL = nostrNetworkSeedRelays\[0\]\.relayUrl/)
		expect(routeParamFixtureSource).toMatch(/const NOSTR_PROBE_NOTE_EVENT_ID = nostrNetworkSeedNotes\[0\]\.eventId/)
		expect(routeParamFixtureSource).toMatch(/const YOUTUBE_PROBE_PLAYLIST_ID = youtubeNetworkSeedPlaylists\[0\]\.playlistId/)
		expect(routeParamFixtureSource).toMatch(/const YOUTUBE_PROBE_VIDEO_ID = youtubeNetworkSeedVideos\[0\]\.videoId/)
		expect(routeParamFixtureSource).toMatch(/const YOUTUBE_PROBE_CHANNEL_ID = youtubeNetworkSeedChannels\[0\]\.channelId/)
		expect(routeParamFixtureSource).toMatch(/const RSS_PROBE_FEED_URL = rssNetworkSeedFeeds\[0\]\.feedUrl/)
		expect(routeParamFixtureSource).toMatch(/const ACTIVITY_PUB_PROBE_ACTOR_URI = `\$\{activityPubNetworkSeedActors\[0\]\.instanceOrigin\}\/users\/Gargron`/)
		expect(routeParamFixtureSource).not.toMatch(/const YOUTUBE_PROBE_(?:PLAYLIST|VIDEO|CHANNEL)_ID = '[^']+'/)
		expect(routeParamFixtureSource).not.toMatch(/const RSS_PROBE_FEED_URL = 'https?:\/\//)
		expect(routeParamFixtureSource).not.toMatch(/const ACTIVITY_PUB_PROBE_ACTOR_URI = 'https?:\/\//)

		expect(dynamicRouteRealSourcesSource).toMatch(/\bnonConstantRemoteCollectionLoads\(events\)/)
		expect(dynamicRouteRealSourcesSource).toMatch(/\.not\.toEqual\(\[\]\)/)
		expect(dynamicRouteRealSourcesSource).toMatch(/liveBackedDynamicRoutePattern/)
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
						'$/sources/SourceProvider.ts',
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

	it('keeps resolvers out of provider metadata and binding modules', () => {
		for (const filePath of scannedSourceFiles.filter((path) => path.startsWith(join(srcPath, 'resolvers')))) {
			const relativePath = filePath.slice(srcPath.length + 1)
			if (relativePath.endsWith('.spec.ts')) continue

			const source = scannedSourceByFilePath[filePath]
			expect(source, relativePath).not.toMatch(/['"]\$\/sources\/[^'"]+\/index\.ts['"]/)
			expect(source, relativePath).not.toMatch(/['"]\$\/sources\/[^'"]+\/bindings\.ts['"]/)
		}
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

	it('keeps persisted collection schema version explicit at the app persistence edge', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]
		const layoutSource = scannedSourceByFilePath[join(srcPath, 'routes', '+layout.svelte')]
		const persistenceSource = scannedSourceByFilePath[join(srcPath, 'constants', 'Persistence.ts')]

		expect(BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION).toBeGreaterThan(1)
		expect(persistenceSource).toMatch(/\bBLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION\b/)
		expect(persistenceSource).not.toMatch(/\bexport const BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION = 1\b/)
		expect(clientSource).not.toMatch(/schemaVersion\s*=\s*1/)
		expect(clientSource).toMatch(/schemaVersion:\s*number/)
		expect(layoutSource).toMatch(/\bBLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION\b/)
		expect(layoutSource).toMatch(/schemaVersion:\s*e2eSchemaVersion\(BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION\)/)
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

	it('keeps dl entity references on EntityView title/value layouts only', () => {
		const generatorSource = readFileSync(join(rootPath, 'scripts', 'app', 'generate.ts'), 'utf8')
		const dlRenderer = generatorSource.match(/const renderEntityReferenceDlItem = \([\s\S]*?\nconst renderContentItem = /)?.[0] ?? ''

		expect(dlRenderer).toMatch(/layout=\{EntityLayout\.Value\}/)
		expect(dlRenderer).not.toMatch(/layout=\{EntityLayout\.(?:Summary|SummaryDetails|Icon)\}/)

		for (const [filePath, source] of Object.entries(scannedSourceByFilePath)) {
			const relativePath = filePath.slice(srcPath.length + 1)
			if (!relativePath.startsWith('views/') || !relativePath.endsWith('.svelte'))
				continue

			for (const match of source.matchAll(/<dl\b[\s\S]*?<\/dl>/g)) {
				const dlSource = match[0]
				expect(dlSource, relativePath).not.toMatch(/layout=\{EntityLayout\.(?:Summary|SummaryDetails|Icon)\}/)
				for (const layoutMatch of dlSource.matchAll(/layout=\{EntityLayout\.([A-Za-z]+)\}/g))
					expect(['Title', 'Value'], `${relativePath}: ${layoutMatch[0]}`).toContain(layoutMatch[1])
			}
		}
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
		const atprotoSource = [
			scannedSourceByFilePath[join(srcPath, 'resolvers', 'Atproto-Xrpc.ts')],
			scannedSourceByFilePath[join(srcPath, 'resolvers', 'Atproto-BskySocial-Xrpc.ts')],
		]
			.flatMap((source) => source.split('defineResolver('))
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

	it('binds every resolver declaration to its module Source', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== '$resolvers.ts'
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
				}, () => moduleSource)
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
			expect(source, filePath).not.toMatch(/\b(?:dedupe|memoize|memoized|cached[A-Z]\w*|cacheOnce|once[A-Z]\w*)\b/)
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

		expect(source).not.toMatch(/^import\s+(?!type\b)[\s\S]*?from ['"]\$\/sources\/(?!Source\.ts['"])/m)
		expect(source).not.toMatch(/\$\/sources\/.*\/(?:client|queries|types)\.ts/)
		expect(source).not.toMatch(/\$\/lib\/http\.ts/)
		expect(source).not.toMatch(/\b(?:fetch|XMLHttpRequest|EventSource|corsFetch|getJson|getText)\s*\(/)
		expect(source).not.toMatch(/\bcontext\.publicEnv\b/)
		expect(source).not.toMatch(/\b(?:backfill|enrich|hydrateCatalog|runtimeCatalog)\b/)
	})

	it('keeps CoinGecko and LI.FI source modules from composing each other directly', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Coingecko', 'Rest', 'coinInstances.ts')]).not.toMatch(/\$\/sources\/Lifi\//)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Lifi', 'Rest', 'coinBridgeCapabilities.ts')]).not.toMatch(/\$\/sources\/Coingecko\//)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Coingecko', 'Rest', 'coinInstances.ts')]).not.toMatch(/\bcoinIdByInstanceKeyCaches\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Lifi', 'Rest', 'routes.ts')]).not.toMatch(/\bresolveBridgeRoute\w+\b/)
	})

	it('keeps EVM JSON-RPC transport selection out of Chainlist source reads', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'sources', 'Evm', 'JsonRpc', 'client.ts')]

		expect(source).not.toMatch(/\$\/sources\/Chainlist\//)
		expect(source).not.toMatch(/\bfetchRpcsJson\b/)
		expect(source).not.toMatch(/\bchainlistRpcs\b/)
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

	it('keeps IPFS source transport details out of generic lib modules', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Ipfs', 'Rest', 'constants.ts')]).toBeUndefined()
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

		expect(source).not.toMatch(/\bexport const (?:normalizeReference|parseBrowseInput|getResourceCanonicalUri|getResourceHref|getResourceAddressFromInput|getResourceAddressFromRouteParams|getGatewayUrl)\b/)
		expect(source).toMatch(/\bexport const fetchBrowseResult\b/)
	})

	it('keeps source query and constants imports inside resolver resolve functions', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(
				/^import\s+(?!type\b)[\s\S]*?from ['"]\$\/sources\/.*\/(?:queries|constants)\.ts['"]/m
			)
		}
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
				/export const \w*(?:ForChainId|ForNetworkKey|SupportedByChainId|SupportedByNetworkKey)\s*=\s*\(/
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
				|| relativePath === 'sources/index.server.ts'
				|| relativePath === 'sources/$sources.ts'
				|| relativePath === 'sources/validateSourceRegistry.ts'
			)
				continue

			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\bimport\.meta\.env\b/)
			expect(source, filePath).not.toMatch(/\$env\/dynamic/)
		}

		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'resolvers'))
			&& basename(path) !== '$resolvers.ts'
			&& basename(path) !== 'index.ts'
		))) {
			const source = scannedSourceByFilePath[filePath]

			expect(source, filePath).not.toMatch(/\bcontext\.publicEnv\.PUBLIC_[A-Z0-9_]+\b/)
		}
	})

	it('keeps source HTTP CORS policy on provider origins instead of source call sites', () => {
		for (const filePath of scannedSourceFiles.filter((path) => (
			path.startsWith(join(srcPath, 'sources'))
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

	it('does not dispatch collection behavior by splitting string collection ids', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]
		const resolverSource = scannedSourceByFilePath[join(srcPath, 'resolvers', '$resolvers.ts')]
		const architectureSource = readFileSync(join(srcPath, 'resolvers', 'subscribe-architecture.spec.ts'), 'utf8')

		expect(clientSource).toMatch(/collectionId: `client\.entities\.\$\{entityDefinition\.entityType\}`/)
		expect(clientSource).toMatch(/const fieldCollectionId = stringify\(\[\s*'client\.fields',\s*entityDefinition\.entityType,\s*facetPath,\s*definition\.name,/)
		expect(clientSource).toMatch(/const countCollectionId = stringify\(\[\s*'client\.counts',\s*entityDefinition\.entityType,\s*facetPath,\s*definition\.name,/)
		expect(clientSource).toMatch(/resolverPartsKey\(entityDefinition\.entityType, facetPath, definition\.name\)/)
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
				&& relativePath !== 'routes/~/(manage)/manage/data/+page.svelte'
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
				|| relativePath === 'client/$e2eProbe.ts'
				|| relativePath === 'client/$e2eTrace.ts'
				|| relativePath === 'routes/~/(manage)/manage/data/+page.svelte'
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

	it('keeps Market_Timestamp feedKey resolvers tied to the requested feed identity', () => {
		for (const fileName of [
			'Blockscout-Rest.ts',
			'Coingecko-OpenApi.ts',
			'Coingecko-Rest.ts',
			'CoinMarketCap-Rest.ts',
			'Coinpaprika-OpenApi.ts',
			'Defillama-OpenApi.ts',
			'Defillama-Rest.ts',
		]) {
			const source = scannedSourceByFilePath[join(srcPath, 'resolvers', fileName)]
			const resolverStart = Math.max(
				source.indexOf('[Market_TimestampSelector.MarketTimestampMsFeedKey]: async'),
				source.indexOf('marketTimestampMsFeedKey: async')
			)
			expect(resolverStart, fileName).toBeGreaterThanOrEqual(0)
			const resolverSource = source.slice(
				resolverStart,
				source.indexOf('})({', resolverStart)
			)

			expect(resolverSource, fileName).toMatch(/\(\{[^}]*\bfeedKey\b/)
			if (fileName.startsWith('Defillama-'))
				expect(resolverSource, fileName).toMatch(/\bllamaId\s*!==\s*feedKey\b/)
			else
				expect(resolverSource, fileName).toMatch(/\bfeedKey\s*!==/)
			expect(resolverSource, fileName).toMatch(/\(\{[^}]*timestampMs:\s*timestampMsSelector/)
			expect(resolverSource, fileName).toMatch(/timestampMs !== timestampMsSelector/)
		}

		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'TradingView-Rest.ts')]).not.toMatch(/\b(?:Market_TimestampSelector|MarketPriceSelector|Date\.now\(\))\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'schema', 'MarketPrice.ts')]).not.toMatch(/\b(?:name: 'feedKey'|name: '\$network'|Source\.TradingView_Rest)\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Source.ts')]).not.toMatch(/export const .*Sources = \[/)
	})

	it('does not present DefiLlama close-price charts as OHLC candles', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'schema', 'Market.ts')]).not.toMatch(
			/name: '\$\$marketTimeIntervalTimestamps'[\s\S]*?defaultSources: \[[^\]]*Source\.Defillama_OpenApi/
		)
		expect(scannedSourceByFilePath[join(srcPath, 'schema', 'Market_TimeInterval_Timestamp.ts')]).not.toMatch(
			/defaultSources: \[[^\]]*Source\.Defillama_OpenApi/
		)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'Defillama-OpenApi.ts')]).not.toMatch(/\b(?:Market_TimeInterval_Timestamp|\$\$marketTimeIntervalTimestamps|getChartOhlcRows)\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Defillama', 'OpenApi', 'queries.ts')]).not.toMatch(/\b(?:OhlcCandle|getChartOhlcRows|Maps DefiLlama chart closes)\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'views', 'Market_TimeInterval_TimestampsView.svelte')] ?? '').not.toMatch(/\bDefiLlama|Defillama\b/)
	})

	it('documents OHLC quote volume as quote-leg units scaled by price scale', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'schema', 'Market_TimeInterval_Timestamp.ts')]

		expect(source).toMatch(/quoteVolume:[\s\S]*description: 'Quote-leg candle volume, scaled by 1e8 like quote prices\.'/)
	})

	it('keeps OHLC candle interval identity separate from provider lookback windows', () => {
		const marketConstants = scannedSourceByFilePath[join(srcPath, 'constants', 'Market.ts')]

		expect(marketConstants).toMatch(/\bmarketOhlcDailyTimeInterval\b/)
		expect(marketConstants).toMatch(/\bmarketOhlcDayLookbackValues\b/)
		expect(marketConstants).not.toMatch(/\bcoingeckoOhlcDayWindowLengths\b/)

		for (const fileName of [
			'Coingecko-OpenApi.ts',
			'Coingecko-Rest.ts',
			'CoinMarketCap-Rest.ts',
			'Coinpaprika-OpenApi.ts',
		]) {
			const source = scannedSourceByFilePath[join(srcPath, 'resolvers', fileName)]
			const resolverBlocks = source.split('defineResolver(').filter((block) => block.includes('EntityType.Market_TimeInterval_Timestamp'))

			expect(resolverBlocks.length, fileName).toBeGreaterThan(0)
			for (const resolverSource of resolverBlocks.filter((block) => /\b(?:getCoinOhlc|getOhlcvHistoricalRows|getOhlcvTodayRows)\b/.test(block))) {
				expect(resolverSource, fileName).not.toMatch(/\bdays:\s*timeInterval\.value\b/)
				expect(resolverSource, fileName).not.toMatch(/\blookbackDayCount:\s*timeInterval\.value\b/)
				expect(resolverSource, fileName).not.toMatch(/\bincludes\(timeInterval\.value\)/)
				expect(resolverSource, fileName).not.toMatch(/\bsome\(\(value\) => value === timeInterval\.value\)/)
				expect(resolverSource, fileName).toMatch(/\btimeInterval:\s*marketOhlcDailyTimeInterval\b/)
				expect(resolverSource, fileName).not.toMatch(/\[EntityMetaKey\.Selector\]:[\s\S]*?\bsource:\s*Source\./)
			}
		}

		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'CoinMarketCap', 'Rest', 'queries.ts')]).toMatch(/count=\$\{lookbackDayCount\}/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Coinpaprika', 'OpenApi', 'queries.ts')]).toMatch(/limit=\$\{lookbackDayCount\}[\s\S]*interval=24h/)
		expect(scannedSourceByFilePath[join(srcPath, 'views', 'Market_TimeInterval_TimestampsView.svelte')] ?? '').not.toMatch(/\btimeInterval = \$bindable/)
		expect(scannedSourceByFilePath[join(srcPath, 'views', 'Market_TimeInterval_TimestampsView.svelte')] ?? '').not.toMatch(/\blookbackDayCount\s*\*\s*24\b/)
	})

	it('does not export legacy raw Persisted collection aliases from app layout', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'routes', '+layout.svelte')]).not.toMatch(
			/\bexport const entity(?:CollectionByEntityType|FieldCollections|FieldCountCollections|CollectionsQueryClient)\b/
		)
	})

})
