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
	'src'
)

const sourceFiles = (
	directory: string
): string[] => (
	readdirSync(directory, {
		withFileTypes: true,
	})
		.flatMap((entry) => (
			entry.isDirectory() ?
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
		const substrateImportsByFilePath = {
			[join(srcPath, 'schema', '$schema.ts')]: [
				'arktype',
				'devalue',
			],
			[join(srcPath, 'sources', '$sources.ts')]: [
				'arktype',
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
			expect(source, filePath).not.toMatch(new RegExp(String.raw`\$\/sources\/(?!\$sources\.ts)`))
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
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', '$resolvers.ts')].match(/:\s*unknown\b/g)).toHaveLength(2)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', '$sources.ts')]).not.toMatch(/\b(?:unknown|any)\b/)
		expect(clientSource.replace(/`[^`]*`/g, '')).not.toMatch(/:\s*(?:unknown|any)\b|Record<string,\s*unknown>|=\s*any\b/)
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

	it('keeps Ethereum network upgrade constants free of Product Data row construction', () => {
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
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Social', 'Atproto.ts')]).not.toMatch(/^export const \w*(?:Did|Uri|Url|Id)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'BitcoinNetwork.ts')]).not.toMatch(/^export const \w*(?:Caip2|DefaultLocalRpcUrl|RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'CosmosNetwork.ts')]).not.toMatch(/^export const \w*(?:Caip2|RpcUrl|RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'ElementsNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'ExecutionRpcOrigins.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'EthereumSpecs.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'FilecoinNetwork.ts')]).not.toMatch(/^export const \w*(?:Caip2|RpcUrl|RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Fedi.ts')]).not.toMatch(/^export const \w*(?:Origin|ApiBase)\b/m)
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
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Voltaire', 'index.ts')]).toMatch(/\$\/sources\/Voltaire\/JsonRpc\/executionEndpoints\.ts/)
	})

	it('keeps generic lib out of Product Data and provider ownership', () => {
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
		expect(clientSource).toMatch(/\bresolveSnapshot[\s\S]*resolverSubset: ResolverSubset\b/)
		expect(clientSource).toMatch(/\bresolveEntity[\s\S]*resolverSubset: ResolverSubset\b/)
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

	it('keeps persisted Product Data schema version explicit at the app persistence edge', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]
		const layoutSource = scannedSourceByFilePath[join(srcPath, 'routes', '+layout.svelte')]
		const persistenceSource = scannedSourceByFilePath[join(srcPath, 'constants', 'Persistence.ts')]

		expect(persistenceSource).toMatch(/\bBLOCKHEAD_PRODUCT_DATA_SCHEMA_VERSION\b/)
		expect(clientSource).not.toMatch(/schemaVersion\s*=\s*1/)
		expect(clientSource).toMatch(/schemaVersion:\s*number/)
		expect(layoutSource).toMatch(/\bBLOCKHEAD_PRODUCT_DATA_SCHEMA_VERSION\b/)
		expect(layoutSource).toMatch(/schemaVersion:\s*\(/)
		expect(layoutSource).toMatch(/:\s*BLOCKHEAD_PRODUCT_DATA_SCHEMA_VERSION\s*\)/)
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

		expect(clientSource).toContain('kind: \'Entity\'')
		expect(clientSource).toContain('kind: \'Field\'')
		expect(clientSource).toContain('kind: \'Count\'')
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
			clientSource.indexOf('const isDeclarativeFieldOrderBy =')
		)

		expect(collectionSetupSource).not.toMatch(/\butils\.write(?:Upsert|Delete|Insert|Update|Batch)\b/)
	})

	it('keeps raw collection writes inside live publisher and local mutation boundaries', () => {
		const clientSource = scannedSourceByFilePath[join(srcPath, 'client', '$client.svelte.ts')]
		const liveWriteSource = clientSource.slice(
			clientSource.indexOf('const replaceFieldRows ='),
			clientSource.indexOf('const parts =')
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
			expect(viewSource, filePath).not.toMatch(/\((?:parent|network)\.\$\$[A-Za-z0-9_]+ \?\? \[\]\)\.slice\(/)
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

	it('keeps appClient usage limited to debug inspection and sanctioned local mutations', () => {
		for (const filePath of scannedSourceFiles) {
			const relativePath = filePath.slice(srcPath.length + 1)
			const source = scannedSourceByFilePath[filePath]
			if (!source.includes('appClient'))
				continue

			if (
				relativePath === 'routes/+layout.svelte'
				|| relativePath === 'routes/~/(manage)/manage/data/+page.svelte'
				|| relativePath.startsWith('routes/test/resource-boundary/')
				|| relativePath.startsWith('routes/test/query-resource-adapter/')
			)
				continue

			expect(relativePath, filePath).toMatch(/^views\//)
			expect(source, filePath).toMatch(/\$\/collections\/localMutations\.ts/)
			expect(source, filePath).not.toMatch(/\bappClient\.(?:entityCollections|entityFieldCollections|entityFieldCountCollections|queryClient|loadedSubsets|events|subscribe)\b/)
			expect(source, filePath).toMatch(/\b(?:write|update|delete)Local[A-Za-z0-9_]*\([\s\S]{0,240}\bappClient\b/)
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
			const resolverStart = source.indexOf('[Market_TimestampSelector.MarketTimestampMsFeedKey]: async')
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
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Source.ts')]).not.toMatch(/marketSpotPriceSources = \[[^\]]*Source\.TradingView_Rest/)
	})

	it('does not present DefiLlama close-price charts as OHLC candles', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Source.ts')]).not.toMatch(
			/marketOhlcCandleSources = \[[^\]]*Source\.Defillama_OpenApi/
		)
		expect(scannedSourceByFilePath[join(srcPath, 'schema', 'Market.ts')]).not.toMatch(
			/name: '\$\$marketTimeIntervalTimestamps'[\s\S]*?defaultSources: \[[^\]]*Source\.Defillama_OpenApi/
		)
		expect(scannedSourceByFilePath[join(srcPath, 'resolvers', 'Defillama-OpenApi.ts')]).not.toMatch(/\b(?:Market_TimeInterval_Timestamp|\$\$marketTimeIntervalTimestamps|getChartOhlcRows)\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Defillama', 'OpenApi', 'queries.ts')]).not.toMatch(/\b(?:OhlcCandle|getChartOhlcRows|Maps DefiLlama chart closes)\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'views', 'Market_TimeInterval_TimestampsView.svelte')]).not.toMatch(/\bDefiLlama|Defillama\b/)
	})

	it('documents OHLC quote volume as quote-leg units scaled by price scale', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'schema', 'Market_TimeInterval_Timestamp.ts')]

		expect(source).toMatch(/Quote-leg candle volume, scaled by 1e8 like quote prices\.[\s\S]*name: 'quoteVolume'/)
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
			}
		}

		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'CoinMarketCap', 'Rest', 'queries.ts')]).toMatch(/count=\$\{lookbackDayCount\}/)
		expect(scannedSourceByFilePath[join(srcPath, 'sources', 'Coinpaprika', 'OpenApi', 'queries.ts')]).toMatch(/limit=\$\{lookbackDayCount\}[\s\S]*interval=24h/)
		expect(scannedSourceByFilePath[join(srcPath, 'views', 'MarketOhlcHub.svelte')]).not.toMatch(/\btimeInterval = \$bindable/)
		expect(scannedSourceByFilePath[join(srcPath, 'views', 'MarketOhlcHub.svelte')]).not.toMatch(/\blookbackDayCount\s*\*\s*24\b/)
	})

	it('does not export legacy raw Product Data collection aliases from app layout', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'routes', '+layout.svelte')]).not.toMatch(
			/\bexport const entity(?:CollectionByEntityType|FieldCollections|FieldCountCollections|CollectionsQueryClient)\b/
		)
	})

})
