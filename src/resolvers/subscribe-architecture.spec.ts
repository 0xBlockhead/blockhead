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
		for (const filePath of [
			join(srcPath, 'schema', '$schema.ts'),
			join(srcPath, 'sources', '$sources.ts'),
			join(srcPath, 'resolvers', '$resolvers.ts'),
			join(srcPath, 'client', '$client.svelte.ts'),
			join(srcPath, 'components', 'ResourceBoundary.svelte'),
			join(srcPath, 'lib', 'db', 'queryResource.svelte.ts'),
		]) {
			const source = scannedSourceByFilePath[filePath]
			const publicTypeBoundarySource = (
				filePath === join(srcPath, 'schema', '$schema.ts') ?
					source.replace(/type SchemaType<[\s\S]*?> = Type<_Value, _Scope>/, '')
				:
					source
			)

			expect(publicTypeBoundarySource, filePath).not.toMatch(broadAnyPattern)
			expect(publicTypeBoundarySource, filePath).not.toMatch(anyAnnotationPattern)
			expect(publicTypeBoundarySource, filePath).not.toMatch(anyGenericDefaultPattern)
		}
	})

	it('keeps product-schema runtime guards out of generic lib', () => {
		expect(scannedSourceFiles.map((filePath) => basename(filePath))).not.toContain('isEntityReferenceWithId.ts')
		expect(scannedSourceFiles.map((filePath) => basename(filePath))).not.toContain('isMarketEntityId.ts')
		expect(scannedSourceFiles.map((filePath) => basename(filePath))).not.toContain('createAction.ts')
		expect(scannedSourceFiles.map((filePath) => basename(filePath))).not.toContain('caip19.ts')
		expect(scannedSourceByFilePath[join(srcPath, 'lib', 'eip6963.ts')]).toBeUndefined()
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
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'BitcoinNetwork.ts')]).not.toMatch(/^export const \w*(?:Caip2|DefaultLocalRpcUrl|RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'CosmosNetwork.ts')]).not.toMatch(/^export const \w*(?:Caip2|RpcUrl|RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'ElementsNetwork.ts')]).not.toMatch(/^export const \w*(?:RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'ExecutionRpcOrigins.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'FilecoinNetwork.ts')]).not.toMatch(/^export const \w*(?:Caip2|RpcUrl|RestBaseUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Fedi.ts')]).not.toMatch(/^export const \w*(?:Origin|ApiBase)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Mastodon.ts')]).not.toMatch(/^export const \w*(?:Default|Origin|ApiBase)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'MevRelayHosts.ts')]).not.toMatch(/^export const \w*(?:Origin|Origins)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Cashu.ts')]).not.toMatch(/^export const \w*(?:Url|Id)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'HyperliquidNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'LightningNetwork.ts')]).not.toMatch(/^export const \w*(?:RestBaseUrl|RpcUrl)\b/m)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'MoneroNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'NearNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'PolkadotNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'SolanaNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'TronNetwork.ts')]).toBeUndefined()
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'QuilibriumNetwork.ts')]).not.toMatch(/\bquilibriumDocsEndpoints\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'ZeroGNetwork.ts')]).not.toMatch(/\bzeroG(?:MainnetRpcEndpoints|MainnetExplorerEndpoints|MainnetStorageEndpoints|StorageNodeRpcEndpoints)\b/)
		expect(scannedSourceByFilePath[join(srcPath, 'constants', 'Network.ts')]).not.toMatch(/\bnetworkResourceUrlsByNetworkSlug\b/)

		for (const filePath of scannedSourceFiles.filter((path) => path.startsWith(join(srcPath, 'constants')))) {
			const source = scannedSourceByFilePath[filePath]

			if (filePath !== join(srcPath, 'constants', 'ExecutionEndpoints.ts'))
				expect(source, filePath).not.toMatch(/^export const \w*Endpoints\b[\s\S]*?\burl:\s*string\b[\s\S]*?\btransportType:\s*TransportType\b/m)
			expect(source, filePath).not.toMatch(/^export\s+(?:async\s+)?function\b/m)
			expect(source, filePath).not.toMatch(/^export\s+(?:class|let|var)\b/m)
			expect(source, filePath).not.toMatch(/\b(?:fetch|XMLHttpRequest|EventSource)\s*\(/)
			expect(source, filePath).not.toMatch(/\bnew\s+WebSocket\s*\(/)
			expect(source, filePath).not.toMatch(/\bimport\.meta\.env\b|\$env\//)
			expect(source, filePath).not.toMatch(/\$\/(?:sources|resolvers)\//)
			expect(source, filePath).not.toMatch(/\$\/schema\/(?:\$schema|EntityType|index)\.ts/)
			expect(source, filePath).not.toMatch(/\bEntity(?:MetaKey|Selector|Type)\b/)
			expect(source, filePath).not.toMatch(/\bEntity<|typeof schema\b|satisfies Entity\b/)
			expect(source, filePath).not.toMatch(/\[\s*EntityMetaKey\.Selector\s*\]/)
		}
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
				expect(match[1], relativePath).not.toMatch(/\$\/resolvers\//)
			}

			expect(source, filePath).not.toMatch(/\bEntityMetaKey\b/)
			expect(source, filePath).not.toMatch(/\$\/schema\/(?:\$schema|EntityType|index)\.ts/)
			expect(source, filePath).not.toMatch(/\bEntity<|typeof schema\b|satisfies Entity\b/)
			expect(source, filePath).not.toMatch(/\[\s*EntityMetaKey\.Selector\s*\]/)
			if (relativePath !== 'lib/http.ts') {
				expect(source, filePath).not.toMatch(/\b(?:fetch|XMLHttpRequest|EventSource)\s*\(/)
				expect(source, filePath).not.toMatch(/\bnew\s+WebSocket\s*\(/)
			}
		}
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

	it('does not register resolver facets that only represent unsupported product surfaces', () => {
		const source = scannedSourceByFilePath[join(srcPath, 'resolvers', 'Constants.ts')]

		expect(source).not.toMatch(/Constants_Internal: \$+\w+ is (?:unsupported|not implemented)/)
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
		}
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

	it('does not export legacy raw Product Data collection aliases from app layout', () => {
		expect(scannedSourceByFilePath[join(srcPath, 'routes', '+layout.svelte')]).not.toMatch(
			/\bexport const entity(?:CollectionByEntityType|FieldCollections|FieldCountCollections|CollectionsQueryClient)\b/
		)
	})

})
