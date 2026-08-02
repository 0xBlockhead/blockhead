import {
	readFileSync,
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
	SourceTargetKind,
	WireProtocol,
	indexSourceBindings,
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
	httpProxyOrigins,
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

	it('derives HTTP proxy origins from enabled HttpProxy HTTP endpoints', () => {
		expect(httpProxyOrigins).toEqual(new Set(
			enabledSourceBindings
				.filter((binding) => binding.delivery === SourceDelivery.HttpProxy)
				.flatMap((binding) => (
					binding.endpoints
						.flatMap((endpoint) => sourceEndpointOrigin(endpoint) ?? [])
				))
		))
		expect(httpProxyOrigins.size).toBeGreaterThan(0)
		expect([...httpProxyOrigins].every((origin) => (
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
		expect(httpProxyOrigins.has('wss://ethereum.publicnode.com')).toBe(false)
		expect(remoteLiveBindings.flatMap((binding) => (
			binding.endpoints
				.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
				.map((endpoint) => endpoint.locator)
		)).some((locator) => httpProxyOrigins.has(locator))).toBe(false)
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

	it('serves RemoteLive through sourceLive instead of the HTTP proxy', () => {
		expect(readFileSync('src/sources/_runtime/live.remote.ts', 'utf8'))
			.toMatch(/export const sourceLive = query\.live/)
		expect(readFileSync('src/sources/_runtime/live.remote.ts', 'utf8'))
			.not.toMatch(/api-proxy|corsFetch|sourceFetch/)
		expect(readFileSync('src/sources/_runtime/proxy.server.ts', 'utf8'))
			.not.toMatch(/RemoteLive|WebSocket/)
	})

	it('keeps managed gRPC behind the server-owned RemoteLive boundary', () => {
		const remoteSource = readFileSync('src/sources/_runtime/live.remote.ts', 'utf8')
		const clientSource = readFileSync('src/sources/_shared/wire/Grpc/live.ts', 'utf8')
		const serverSource = readFileSync('src/sources/_shared/wire/Grpc/live.server.ts', 'utf8')
		const yellowstoneSource = readFileSync('src/sources/GetBlock/Yellowstone/queries.ts', 'utf8')

		expect(remoteSource).toMatch(/getRequestEvent\(\)\.request\.signal/)
		expect(clientSource).not.toContain('node:http2')
		expect(serverSource).toContain("from 'node:http2'")
		expect(yellowstoneSource).toContain('iterateGrpcLive')
		expect(yellowstoneSource).not.toContain('.server.ts')
		expect(() => statSync('src/sources/GetBlock/Yellowstone/managedGrpc.server.ts')).toThrow()
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

	it('keeps the CORS browser proof free of route-specific delivery ignores', () => {
		expect(readFileSync('tests/e2e/cors-policy.e2e.ts', 'utf8'))
			.not.toMatch(/e2eBoundaryLiveOptionalPathnames|failFast\s*:/)
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
})
