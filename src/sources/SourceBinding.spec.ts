import {
	readFileSync,
	statSync,
} from 'node:fs'

import {
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { Source } from '$/sources/Source.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import generatedSourceProviders from '$/sources/$sourceProviders.ts'
import { auditSourceProviders } from '$/sources/auditSourceProviders.ts'
import { sourceBindings as browserSourceBindings } from '$/sources/index.ts'
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

let sourceProviders: SourceProviderDefinition[]
let sourceBindings: readonly SourceBinding[]

beforeAll(() => {
	sourceProviders = [...generatedSourceProviders]
	sourceBindings = sourceProviders.flatMap((provider) => provider.bindings)
})

const sourceMember = (
	name: string
) => (Source as Record<string, Source | undefined>)[name]

describe('source binding indexes', () => {
	it('keeps every Source enum member represented by one provider source row and one binding source', () => {
		const audit = auditSourceProviders(sourceProviders)

		expect(audit.sourceRows.size).toBe(audit.sourceEnumMembers.length)
		expect(audit.bindingSources.size).toBe(audit.sourceEnumMembers.length)
		expect(audit.missingSourceRows).toEqual([])
		expect(audit.sourcesWithoutBindings).toEqual([])
		expect(audit.bindingSourcesWithoutRows).toEqual([])
		expect(audit.bindingsOutsideProviderRows).toEqual([])
		expect(audit.providersWithoutBindings).toEqual([])
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
						.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
						.flatMap((endpoint) => endpoint.origin == null ? [] : [endpoint.origin])
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

	it('keeps public config credentials schema-backed', () => {
		expect(sourceBindings.flatMap((binding) => (
			binding.credentials.flatMap((credential) => (
				credential.scope === SourceCredentialScope.PublicConfig && credential.keys != null ?
					credential.keys.flatMap((key) => (
						credential.env?.props.some((property) => property.key === key) === true ?
							[]
						:
							[`${binding.source}:${key}`]
					))
				:
					[]
			))
		))).toEqual([])
	})

	it('keeps RemoteLive WebSocket bindings out of the HTTP proxy origins', () => {
		expect(remoteLiveBindings.some((binding) => (
			binding.source === Source.Voltaire_JsonRpc
			&& binding.delivery === SourceDelivery.RemoteLive
		))).toBe(true)
		expect(httpProxyOrigins.has('wss://ethereum.publicnode.com')).toBe(false)
		expect(remoteLiveBindings.flatMap((binding) => (
			binding.endpoints
				.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
				.map((endpoint) => endpoint.locator)
		)).some((locator) => httpProxyOrigins.has(locator))).toBe(false)
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
				proxyId: 'blockscout-rest-fixture',
				endpoints: [{
					...binding.endpoints[0],
					corsEnabled: true,
				}],
			}, 'https://eth.blockscout.com/api')
			expect(fetchMock).toHaveBeenCalledWith(
				'/api-proxy/blockscout-rest-fixture/0/https%3A%2F%2Feth.blockscout.com%2Fapi',
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
				`/api-proxy/${encodeURIComponent(redditPublicBindings[Source.Reddit_PublicJson].proxyId)}/0/https%3A%2F%2Fwww.reddit.com%2Fr%2Fpopular%2F.rss`,
				`/api-proxy/${encodeURIComponent(neynarBindings[Source.Neynar_Rest].proxyId)}/0/https%3A%2F%2Fapi.neynar.com%2Fv2%2Ffarcaster%2Ffeed%2F%3Ffeed_type%3Dfilter%26filter_type%3Dglobal_trending`,
				`/api-proxy/${encodeURIComponent(snapchainBindings[Source.Snapchain_Rest].proxyId)}/0/https%3A%2F%2Fhub.pinata.cloud%2Fv1%2Ffids%3FpageSize%3D100`,
			])
		} finally {
			vi.unstubAllGlobals()
		}
	})

	it('keeps the CORS browser proof free of route-specific delivery ignores', () => {
		expect(readFileSync('tests/e2e/cors-policy.e2e.ts', 'utf8'))
			.not.toMatch(/e2eBoundaryLiveOptionalPathnames|failFast\s*:/)
	})

	it('models generated OpenAPI artifacts as binding metadata', () => {
		expect(sourceBindings.some((binding) => (
			binding.source === Source.Coingecko_OpenApi
			&& binding.apiFamily === ApiFamily.OpenApiHttp
			&& binding.artifacts?.some((artifact) => (
				artifact.kind === SourceArtifactKind.OpenApiTypes
				&& artifact.path === 'src/sources/Coingecko/OpenApi/openapi.d.ts'
				&& artifact.generated
			))
		))).toBe(true)
	})

	it('models Coingecko REST separately from its OpenAPI artifact-backed binding', () => {
		expect(sourceBindings.some((binding) => (
			binding.source === Source.Coingecko_Rest
			&& binding.apiFamily === ApiFamily.RestJson
			&& binding.artifacts?.some((artifact) => (
				artifact.kind === SourceArtifactKind.HandwrittenTypes
				&& artifact.path === 'src/sources/Coingecko/Rest/types.ts'
			))
		))).toBe(true)
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
