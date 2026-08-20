import {
	statSync,
} from 'node:fs'

import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	indexSourceBindings,
	mergeSourceBindingIndexes,
	sourceBindingId,
	sourceEndpointOrigin,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import generatedSourceProviders, { sourceBindings } from '$/sources/$sourceProviders.ts'
import sourceServerCredentialsById from '$/sources/$sourceServerCredentials.server.ts'
import { auditSourceProviders } from '$/sources/auditSourceProviders.ts'
import {
	networkApplicableSources,
	sourceBindings as browserSourceBindings,
} from '$/sources/index.ts'
import {
	enabledSourceBindings,
	remoteLiveBindings,
} from '$/sources/index.server.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import neynarBindings from '$/sources/Neynar/bindings.ts'
import { neynarFetch } from '$/sources/Neynar/Rest/client.ts'
import redditPublicBindings from '$/sources/RedditPublic/bindings.ts'
import { redditTextGet } from '$/sources/RedditPublic/Rest/client.ts'
import snapchainBindings from '$/sources/Snapchain/bindings.ts'
import { snapchainGet } from '$/sources/Snapchain/Rest/client.ts'

const sourceProviders = generatedSourceProviders

const enabledHttpProxyOrigins = new Set(
	enabledSourceBindings
		.filter((binding) => binding.delivery === SourceDelivery.HttpProxy)
		.flatMap((binding) => binding.endpoints)
		.flatMap((endpoint) => sourceEndpointOrigin(endpoint) ?? [])
)

const sourceMember = (
	name: string
) => (Source as Record<string, Source | undefined>)[name]

describe('source binding indexes', () => {
	it('retains every present source bucket as one nonempty array shape', () => {
		const binding = sourceBindings[0]

		expect(indexSourceBindings([binding].flatMap((binding) => [binding]))[binding.source])
			.toEqual([binding])
		expect(() => indexSourceBindings([binding, binding].flatMap((binding) => [binding])))
			.toThrow('must not contain duplicate stable identities')
		expect(() => indexSourceBindings([])).toThrow('must contain at least one binding')
	})

	it('rejects one source owned by multiple provider binding indexes', () => {
		const binding = sourceBindings[0]

		expect(() => mergeSourceBindingIndexes(
			indexSourceBindings([binding]),
			indexSourceBindings([binding])
		)).toThrow('Each source must belong to exactly one provider binding index')
	})

	it('derives binding identity from only the five stable selection axes', () => {
		const binding = sourceBindings.find(({ source }) => source === Source.Blockscout_Rest)
		expect(binding).toBeDefined()
		if (binding == null)
			throw new Error('Blockscout binding is missing')

		const identity = JSON.stringify([
			binding.source,
			binding.target.kind,
			binding.target.key,
			binding.delivery,
			binding.apiFamily,
		])
		expect(sourceBindingId(binding)).toBe(identity)
		const wireProtocolMutation = {
			...binding,
			wireProtocol: WireProtocol.RawHttp,
		}
		expect(sourceBindingId(wireProtocolMutation)).toBe(identity)
	})

	it('keeps every Source enum member represented by one provider source row and one binding source', () => {
		const audit = auditSourceProviders(sourceProviders)
		for (const { bindings } of sourceProviders)
			for (const [source, sourceBindings] of Object.entries(bindings)) {
				expect(sourceBindings.length).toBeGreaterThan(0)
				expect(sourceBindings.every((binding) => binding.source === source)).toBe(true)
			}

		expect(audit.sourceRows.size).toBe(audit.sourceEnumMembers.length)
		expect(audit.bindingSources.size).toBe(audit.sourceEnumMembers.length)
		expect(audit.missingSourceRows).toEqual([])
		expect(audit.sourcesWithoutBindings).toEqual([])
		expect(audit.bindingSourcesWithoutRows).toEqual([])
		expect(audit.bindingsOutsideProviderRows).toEqual([])
		expect(audit.providersWithoutBindings).toEqual([])
	})

	it('keeps every server credential attached to a registered binding', () => {
		expect([...sourceServerCredentialsById.keys()].filter((bindingId) => (
			!sourceBindings.some((binding) => sourceBindingId(binding) === bindingId)
		))).toEqual([])
	})

	it('derives browser enabled sources from browser-safe bindings', () => {
		expect([...new Set(browserSourceBindings.map((binding) => binding.source))].length)
			.toBeLessThanOrEqual(sourceBindings.length)
	})

	it('keeps enabled HttpProxy endpoints on HTTP origins', () => {
		expect(enabledHttpProxyOrigins.size).toBeGreaterThan(0)
		expect([...enabledHttpProxyOrigins].every((origin) => (
			origin.startsWith('http://') || origin.startsWith('https://')
		))).toBe(true)
	})

	it('keeps live social HTTP on the proxy for non-CORS provider endpoints', () => {
		expect(sourceBindings
			.filter((binding) => [
				Source.Neynar_Rest,
				Source.Reddit_PublicJson,
				Source.Snapchain_Rest,
			].includes(binding.source))
			.map((binding) => ({
				source: binding.source,
				delivery: binding.delivery,
				endpoints: binding.endpoints.map((endpoint) => ({
					locator: endpoint.locator,
					corsEnabled: endpoint.corsEnabled,
				})),
			})))
			.toEqual([
				{
					source: Source.Neynar_Rest,
					delivery: SourceDelivery.HttpProxy,
					endpoints: [
						{
							locator: 'https://api.neynar.com',
							corsEnabled: false,
						},
					],
				},
				{
					source: Source.Reddit_PublicJson,
					delivery: SourceDelivery.HttpProxy,
					endpoints: [
						{
							locator: 'https://www.reddit.com',
							corsEnabled: false,
						},
					],
				},
				{
					source: Source.Snapchain_Rest,
					delivery: SourceDelivery.HttpProxy,
					endpoints: [
						{
							locator: 'https://hub.pinata.cloud',
							corsEnabled: false,
						},
						{
							locator: 'https://snap.farcaster.xyz:3381',
							corsEnabled: false,
						},
						{
							locator: 'https://pop.farcaster.xyz:3381',
							corsEnabled: false,
						},
						{
							locator: 'https://haatz.quilibrium.com',
							corsEnabled: false,
						},
					],
				},
			])
	})

	it('derives public config credential keys from their schemas', () => {
		expect(sourceBindings.flatMap((binding) => (
			binding.credentials.flatMap((credential) => (
				credential.scope === SourceCredentialScope.PublicConfig
				&& 'keys' in credential ?
					[binding.source]
				:
					[]
			))
		))).toEqual([])
		expect(sourceBindings
			.find((binding) => binding.source === Source.Allium_Rest)
			?.credentials.flatMap((credential) => (
				credential.scope === SourceCredentialScope.PublicConfig ?
					credential.env?.props.map(({ key }) => String(key)) ?? []
				:
					[]
			))).toEqual(['PUBLIC_ALLIUM_API_KEY'])
	})

	it('keeps RemoteLive WebSocket bindings out of the HTTP proxy origins', () => {
		expect(remoteLiveBindings.some((binding) => (
			binding.source === Source.Voltaire_JsonRpc
		))).toBe(true)
		expect(enabledHttpProxyOrigins.has('wss://ethereum.publicnode.com')).toBe(false)
		expect(remoteLiveBindings.flatMap((binding) => (
			binding.endpoints
				.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
				.map((endpoint) => endpoint.locator)
		)).some((locator) => enabledHttpProxyOrigins.has(locator))).toBe(false)
	})

	it('keeps social, storage, and operator reads on their verified delivery boundaries', () => {
		expect(sourceBindings.filter((binding) => (
			[
				Source.Mastodon_Rest,
				Source.NostrRelay_Nip11_Http,
				Source.NostrRelay_WebSocket,
				Source.Atproto_Xrpc,
				Source.AtprotoSync_Xrpc,
				Source.Farcaster_Rest,
				Source.Arweave_Graphql,
				Source.Arweave_Rest,
				Source.Ipfs_Rest,
				Source.Swarm_Rest,
				Source.ZeroGStorageNode_JsonRpc,
				Source.QuilibriumNodeMetrics_Prometheus,
				Source.Radicle_Local,
				Source.Radicle_Remote,
				Source.RadicleCli_Local,
				Source.RadicleNode_Control,
			].includes(binding.source)
		)).map((binding) => ({
			source: binding.source,
			target: binding.target.key,
			delivery: binding.delivery,
			wireProtocol: binding.wireProtocol,
			operations: binding.operationGroups,
		}))).toEqual([
			{
				source: Source.Arweave_Graphql,
				target: 'arweave',
				delivery: SourceDelivery.BrowserDirect,
				wireProtocol: WireProtocol.Graphql,
				operations: [SourceOperationGroup.GenericRead],
			},
			{
				source: Source.Arweave_Rest,
				target: 'arweave',
				delivery: SourceDelivery.BrowserDirect,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.ContentGatewayRead],
			},
			{
				source: Source.Atproto_Xrpc,
				target: 'bsky-public-appview',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.Xrpc,
				operations: [SourceOperationGroup.GenericRead],
			},
			{
				source: Source.AtprotoSync_Xrpc,
				target: 'atproto-sync',
				delivery: SourceDelivery.RemoteQuery,
				wireProtocol: WireProtocol.Xrpc,
				operations: [SourceOperationGroup.GenericRead],
			},
			{
				source: Source.AtprotoSync_Xrpc,
				target: 'atproto-sync',
				delivery: SourceDelivery.RemoteLive,
				wireProtocol: WireProtocol.Xrpc,
				operations: [SourceOperationGroup.GenericSubscribe],
			},
			{
				source: Source.Farcaster_Rest,
				target: 'client-api',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.GenericRead],
			},
			{
				source: Source.Farcaster_Rest,
				target: 'web-api',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.GenericRead],
			},
			{
				source: Source.Ipfs_Rest,
				target: 'ipfs',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.ContentGatewayRead],
			},
			{
				source: Source.Mastodon_Rest,
				target: 'mastodon-instance:https://mastodon.social',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.GenericRead],
			},
			{
				source: Source.Mastodon_Rest,
				target: 'mastodon-instance:https://fosstodon.org',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.GenericRead],
			},
			{
				source: Source.Mastodon_Rest,
				target: 'mastodon-public-timeline:https://fosstodon.org',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.GenericRead],
			},
			{
				source: Source.NostrRelay_Nip11_Http,
				target: 'wss://nos.lol',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.NostrRelayRead],
			},
			{
				source: Source.NostrRelay_Nip11_Http,
				target: 'wss://relay.damus.io',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.NostrRelayRead],
			},
			{
				source: Source.NostrRelay_Nip11_Http,
				target: 'wss://relay.nostr.band',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.NostrRelayRead],
			},
			{
				source: Source.NostrRelay_Nip11_Http,
				target: 'wss://relay.primal.net',
				delivery: SourceDelivery.HttpProxy,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.NostrRelayRead],
			},
			{
				source: Source.NostrRelay_WebSocket,
				target: 'wss://nos.lol',
				delivery: SourceDelivery.RemoteLive,
				wireProtocol: WireProtocol.WebSocketMessages,
				operations: [
					SourceOperationGroup.GenericSubscribe,
					SourceOperationGroup.NostrRelayPublish,
					SourceOperationGroup.NostrRelayRead,
				],
			},
			{
				source: Source.NostrRelay_WebSocket,
				target: 'wss://relay.damus.io',
				delivery: SourceDelivery.RemoteLive,
				wireProtocol: WireProtocol.WebSocketMessages,
				operations: [
					SourceOperationGroup.GenericSubscribe,
					SourceOperationGroup.NostrRelayPublish,
					SourceOperationGroup.NostrRelayRead,
				],
			},
			{
				source: Source.NostrRelay_WebSocket,
				target: 'wss://relay.nostr.band',
				delivery: SourceDelivery.RemoteLive,
				wireProtocol: WireProtocol.WebSocketMessages,
				operations: [
					SourceOperationGroup.GenericSubscribe,
					SourceOperationGroup.NostrRelayPublish,
					SourceOperationGroup.NostrRelayRead,
					SourceOperationGroup.NostrSearch,
				],
			},
			{
				source: Source.NostrRelay_WebSocket,
				target: 'wss://relay.primal.net',
				delivery: SourceDelivery.RemoteLive,
				wireProtocol: WireProtocol.WebSocketMessages,
				operations: [
					SourceOperationGroup.GenericSubscribe,
					SourceOperationGroup.NostrRelayPublish,
					SourceOperationGroup.NostrRelayRead,
				],
			},
			{
				source: Source.QuilibriumNodeMetrics_Prometheus,
				target: 'quilibrium-node',
				delivery: SourceDelivery.ServerOnly,
				wireProtocol: WireProtocol.Prometheus,
				operations: [SourceOperationGroup.GenericRead],
			},
			{
				source: Source.Radicle_Local,
				target: 'radicle-repository',
				delivery: SourceDelivery.LocalOnly,
				wireProtocol: WireProtocol.LocalFile,
				operations: [
					SourceOperationGroup.GitRepositoryContents,
					SourceOperationGroup.RepositoryMetadata,
				],
			},
			{
				source: Source.Radicle_Remote,
				target: 'radicle-repository',
				delivery: SourceDelivery.RemoteQuery,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.RepositoryMetadata],
			},
			{
				source: Source.RadicleCli_Local,
				target: 'radicle-cli',
				delivery: SourceDelivery.LocalOnly,
				wireProtocol: WireProtocol.InProcess,
				operations: [
					SourceOperationGroup.GenericRead,
					SourceOperationGroup.IssueTracking,
					SourceOperationGroup.PullRequestReview,
					SourceOperationGroup.RepositoryMetadata,
				],
			},
			{
				source: Source.RadicleNode_Control,
				target: 'radicle-node',
				delivery: SourceDelivery.ServerOnly,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.RepositoryMetadata],
			},
			{
				source: Source.Swarm_Rest,
				target: 'swarm',
				delivery: SourceDelivery.BrowserDirect,
				wireProtocol: WireProtocol.HttpRest,
				operations: [SourceOperationGroup.ContentGatewayRead],
			},
			{
				source: Source.ZeroGStorageNode_JsonRpc,
				target: 'local-0g-storage-node',
				delivery: SourceDelivery.LocalOnly,
				wireProtocol: WireProtocol.JsonRpc2,
				operations: [SourceOperationGroup.GenericRead],
			},
		])
	})

	it('derives network source applicability directly from binding targets', () => {
		const sources = [
			Source.Avail,
			Source.EnvioHyperRpc_JsonRpc,
			Source.Constants_Internal,
		]

		expect(networkApplicableSources(sources, {
			slug: 'avail',
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		})).toEqual(sources)
		expect(networkApplicableSources(sources, {
			slug: 'algorand',
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		})).toEqual([
			Source.Constants_Internal,
		])
	})

	it('proxies TRON APIs with server-owned key injection', () => {
		const tronGridBinding = sourceBindings.find(({ source }) => source === Source.TronGrid_Rest)
		const tronScanBinding = sourceBindings.find(({ source }) => source === Source.TronScan_Rest)
		expect(tronGridBinding).toBeDefined()
		expect(tronScanBinding).toBeDefined()
		if (tronGridBinding == null || tronScanBinding == null)
			throw new Error('TRON source bindings are missing')

		expect([tronGridBinding, tronScanBinding]).toMatchObject([
			{
				delivery: SourceDelivery.HttpProxy,
				endpoints: [{
					locator: 'https://api.trongrid.io',
					corsEnabled: false,
				}],
				credentials: [{
					scope: SourceCredentialScope.RuntimeSecret,
				}],
			},
			{
				delivery: SourceDelivery.HttpProxy,
				endpoints: [{
					locator: 'https://apilist.tronscanapi.com',
					corsEnabled: false,
				}],
				credentials: [{
					scope: SourceCredentialScope.RuntimeSecret,
				}],
			},
		])
		expect(sourceServerCredentialsById.get(sourceBindingId(tronGridBinding))).toEqual({
			envKey: 'TRONGRID_API_KEY',
			injection: {
				header: {
					name: 'TRON-PRO-API-KEY',
				},
			},
		})
		expect(sourceServerCredentialsById.get(sourceBindingId(tronScanBinding))).toEqual({
			envKey: 'TRONSCAN_API_KEY',
			injection: {
				header: {
					name: 'TRON-PRO-API-KEY',
				},
			},
		})
	})

	it('routes source HTTP from the binding delivery contract', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response('ok'))
		const binding = sourceBindings.find((binding) => binding.source === Source.Blockscout_Rest)
		expect(binding).toBeDefined()
		if (binding == null)
			throw new Error('Blockscout binding is missing')

		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		try {
			await sourceFetch({
				...binding,
				endpoints: [{
					...binding.endpoints[0],
					corsEnabled: true,
				}],
			}, 'https://eth.blockscout.com/api')
			expect(fetchMock).toHaveBeenCalledWith(
				`/api-proxy/${encodeURIComponent(sourceBindingId(binding))}/0/https%3A%2F%2Feth.blockscout.com%2Fapi`,
				expect.objectContaining({
					signal: expect.any(AbortSignal),
				})
			)
		} finally {
			vi.unstubAllGlobals()
		}
	})

	it('routes live social clients through their generated HTTP proxy identities', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockImplementation(async () => new Response('{}'))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		try {
			await redditTextGet('/r/popular/.rss')
			await neynarFetch(
				{ PUBLIC_NEYNAR_API_KEY: 'test-key' },
				'/v2/farcaster/feed/?feed_type=filter&filter_type=global_trending'
			)
			await snapchainGet('/v1/fids', { pageSize: 100 })

			expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
				`/api-proxy/${encodeURIComponent(sourceBindingId(redditPublicBindings[Source.Reddit_PublicJson][0]))}/0/https%3A%2F%2Fwww.reddit.com%2Fr%2Fpopular%2F.rss`,
				`/api-proxy/${encodeURIComponent(sourceBindingId(neynarBindings[Source.Neynar_Rest][0]))}/0/https%3A%2F%2Fapi.neynar.com%2Fv2%2Ffarcaster%2Ffeed%2F%3Ffeed_type%3Dfilter%26filter_type%3Dglobal_trending`,
				`/api-proxy/${encodeURIComponent(sourceBindingId(snapchainBindings[Source.Snapchain_Rest][0]))}/0/https%3A%2F%2Fhub.pinata.cloud%2Fv1%2Ffids%3FpageSize%3D100`,
			])
		} finally {
			vi.unstubAllGlobals()
		}
	})

	it('models Demo and Pro contracts on one Coingecko source', () => {
		expect(sourceBindings.filter((binding) => (
			binding.source === Source.Coingecko_Rest
			&& binding.apiFamily === ApiFamily.OpenApiHttp
		)).flatMap((binding) => (
			binding.artifacts?.flatMap((artifact) => (
				artifact.kind === SourceArtifactKind.OpenApiTypes ?
					[artifact.path]
				:
					[]
			)) ?? []
		))).toEqual([
			'src/sources/Coingecko/OpenApi/openapi.d.ts',
			'src/sources/Coingecko/OpenApi/Pro/openapi.d.ts',
		])
	})

	it('models Superchain registry as a Git repository binding on the shared GitHub host', () => {
		expect(sourceBindings.filter((binding) => (
			binding.source === Source.Superchain_Github
			&& binding.apiFamily === ApiFamily.GithubContentsApi
			&& binding.target.kind === SourceTargetKind.GitRepository
		)).map((binding) => binding.target.key).sort()).toEqual([
			'ethereum-optimism/superchain-registry@main:chainList.json',
		])
	})

	it('keeps declared source artifacts backed by checked-in files', () => {
		expect(
			sourceBindings
				.flatMap((binding) => binding.artifacts ?? [])
				.every((artifact) => {
					const stat = statSync(artifact.path)
					return stat.isFile() || stat.isDirectory()
				})
		).toBe(true)
	})

	it('models runtime-secret server-only bindings outside browser delivery', () => {
		expect(sourceBindings.some((binding) => (
			binding.source === Source.TezosDappetizer_Postgres
			&& binding.apiFamily === ApiFamily.Postgres
			&& binding.delivery === SourceDelivery.ServerOnly
			&& binding.credentials.some((credential) => (
				credential.scope === SourceCredentialScope.RuntimeSecret
				&& credential.keys?.includes('TEZOS_DAPPETIZER_DATABASE_URL')
			))
		))).toBe(true)
	})

	it('keeps authored credential and Cashu capability facts aligned with generated server metadata', () => {
		expect(Object.fromEntries([
			Source.CardanoDbSync_Postgres,
			Source.Conseil_Postgres,
			Source.LightningLnd_Rest,
			Source.X_Rest,
		].map((source) => {
			const binding = sourceBindings.find((binding) => binding.source === source)
			if (binding == null)
				throw new Error(`${source} binding is missing`)

			return [
				source,
				binding.credentials.map((credential) => ({
					scope: credential.scope,
					keys: credential.keys,
					envKeys: credential.env?.props.map(({ key }) => String(key)),
				})),
			]
		}))).toEqual({
			[Source.CardanoDbSync_Postgres]: [{
				scope: SourceCredentialScope.RuntimeSecret,
				keys: ['CARDANO_DB_SYNC_DATABASE_URL'],
				envKeys: ['CARDANO_DB_SYNC_DATABASE_URL'],
			}],
			[Source.Conseil_Postgres]: [{
				scope: SourceCredentialScope.RuntimeSecret,
				keys: ['CONSEIL_DATABASE_URL'],
				envKeys: ['CONSEIL_DATABASE_URL'],
			}],
			[Source.LightningLnd_Rest]: [{
				scope: SourceCredentialScope.RuntimeSecret,
				keys: ['LND_MACAROON_HEX'],
				envKeys: undefined,
			}],
			[Source.X_Rest]: [{
				scope: SourceCredentialScope.RuntimeSecret,
				keys: ['X_API_BEARER'],
				envKeys: undefined,
			}],
		})

		for (const [source, serverCredential] of [
			[
				Source.LightningLnd_Rest,
				{
					envKey: 'LND_MACAROON_HEX',
					injection: {
						header: {
							name: 'Grpc-Metadata-macaroon',
						},
					},
				},
			],
			[
				Source.X_Rest,
				{
					envKey: 'X_API_BEARER',
					injection: {
						header: {
							name: 'Authorization',
							prefix: 'Bearer ',
						},
					},
				},
			],
		] as const) {
			const binding = sourceBindings.find((binding) => binding.source === source)
			if (binding == null)
				throw new Error(`${source} binding is missing`)

			expect(sourceServerCredentialsById.get(sourceBindingId(binding))).toEqual(serverCredential)
		}

		expect(sourceBindings.find((binding) => (
			binding.source === Source.CashuMint_Rest
		))?.operationGroups).toEqual([
			SourceOperationGroup.EcashMintOperations,
			SourceOperationGroup.GenericRead,
		])
	})

	it('keeps server-only bindings out of the browser registry', () => {
		expect(browserSourceBindings.some((binding) => (
			binding.source === Source.TezosDappetizer_Postgres
		))).toBe(false)
	})

	it('keeps runtime-secret remote bindings in the browser-facing source registry', () => {
		expect(browserSourceBindings.some((binding) => (
			binding.source === Source.GoogleAi_Rest
			&& binding.delivery === SourceDelivery.RemoteQuery
			&& binding.credentials.some((credential) => credential.scope === SourceCredentialScope.RuntimeSecret)
		))).toBe(true)
	})

	it('keeps OpenSea credentials outside its browser-reachable query closure', () => {
		const openSeaBinding = sourceBindings.find((binding) => (
			binding.source === Source.OpenSea_Rest
		))
		if (openSeaBinding == null)
			throw new Error('OpenSea binding is missing')

		expect(sourceBindingId(openSeaBinding)).toBe(
			'["OpenSea_Rest","Global","opensea-api","HttpProxy","OpenApiHttp"]'
		)
		expect(openSeaBinding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(openSeaBinding.credentials).toEqual([{
			scope: SourceCredentialScope.RuntimeSecret,
		}])
		expect(sourceServerCredentialsById.get(sourceBindingId(openSeaBinding))).toEqual({
			envKey: 'OPENSEA_API_KEY',
			injection: {
				header: {
					name: 'x-api-key',
				},
			},
		})
		expect(openSeaBinding.credentials.some((credential) => (
			credential.scope === SourceCredentialScope.PublicConfig
		))).toBe(false)
		expect(browserSourceBindings.some((binding) => (
			binding.source === Source.OpenSea_Rest
			&& binding.credentials.some((credential) => (
				credential.scope === SourceCredentialScope.PublicConfig
			))
		))).toBe(false)
	})

	it('keeps Reddit OAuth authority on one server-credential binding', () => {
		const redditBindings = sourceBindings.filter((binding) => (
			binding.source === Source.Reddit_Rest
		))
		const [redditBinding] = redditBindings
		if (redditBinding == null)
			throw new Error('Reddit binding is missing')

		expect(redditBindings.map(sourceBindingId)).toEqual([
			'["Reddit_Rest","Global","oauth-api","HttpProxy","RestJson"]',
		])
		expect(redditBinding.credentials).toEqual([{
			scope: SourceCredentialScope.RuntimeSecret,
		}])
		expect(sourceServerCredentialsById.get(sourceBindingId(redditBinding))).toEqual({
			envKey: 'REDDIT_CLIENT_SECRET',
			injection: {
				header: {
					name: 'authorization',
					prefix: 'Bearer ',
				},
			},
			oauthClientCredentials: {
				clientIdEnvKey: 'REDDIT_CLIENT_ID',
				tokenEndpoint: 'https://www.reddit.com/api/v1/access_token',
				userAgent: 'Blockhead/1.0.0 (+https://blockhead.vision) by /u/blockhead',
			},
		})
		expect(browserSourceBindings.some((binding) => (
			binding.source === Source.Reddit_Rest
			&& binding.credentials.some((credential) => (
				credential.scope === SourceCredentialScope.PublicConfig
			))
		))).toBe(false)
	})
})
