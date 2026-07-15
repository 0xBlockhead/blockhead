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
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceProviders as generatedSourceProviders } from '$/sources/$sourceProviders.ts'
import { sourceBindingCompatibility } from '$/sources/$sourceBindingCompatibility.ts'
import { auditSourceProviders } from '$/sources/auditSourceProviders.ts'
import { sourceBindings as browserSourceBindings } from '$/sources/index.ts'
import {
	enabledSourceBindings,
	httpProxyOrigins,
	remoteLiveBindings,
} from '$/sources/index.server.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { validateSourceBinding } from '$/sources/validateSourceBindings.ts'
import { validateSourceBindings } from '$/sources/validateSourceBindings.ts'

const validBinding = {
	provider: SourceProvider.Blockscout,
	source: Source.Blockscout_Rest,
	target: {
		kind: SourceTargetKind.Eip155Chain,
		key: '1',
	},
	endpoints: [
		{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: 'https://eth.blockscout.com',
			origin: 'https://eth.blockscout.com',
			corsEnabled: false,
		},
	],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.BlockscoutRestV2,
	operationGroups: [
		SourceOperationGroup.GenericRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [
		{
			scope: SourceCredentialScope.None,
		},
	],
} as const satisfies SourceBinding

let sourceProviders: SourceProviderDefinition[]
let sourceBindings: readonly SourceBinding[]

beforeAll(() => {
	sourceProviders = [...generatedSourceProviders]
	sourceBindings = validateSourceBindings(sourceProviders.flatMap((provider) => provider.bindings))
})

const sourceMember = (
	name: string
) => (Source as Record<string, Source | undefined>)[name]

describe('SourceBinding validation', () => {
	it('accepts a valid HTTP proxy binding', () => {
		expect(validateSourceBinding(validBinding)).toBe(validBinding)
	})

	it('rejects empty endpoint and operation-group arrays', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			endpoints: [],
		})).toThrow('source binding requires at least one endpoint')
		expect(() => validateSourceBinding({
			...validBinding,
			operationGroups: [],
		})).toThrow('source binding requires at least one operation group')
	})

	it('rejects an API family incompatible with the wire protocol', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			apiFamily: ApiFamily.GraphqlHttp,
		})).toThrow('GraphqlHttp is incompatible with HttpRest')
	})

	it('fails closed when a compatibility policy marker is absent', () => {
		const compatibility = sourceBindingCompatibility.find((candidate) => (
			candidate.wireProtocol === validBinding.wireProtocol
			&& candidate.apiFamilies.includes(validBinding.apiFamily)
		))

		expect(compatibility).toBeDefined()
		const operationGroups = compatibility?.operationGroups
		Reflect.deleteProperty(compatibility ?? {}, 'operationGroups')
		try {
			expect(() => validateSourceBinding(validBinding)).toThrow('compatibility row requires an explicit operation group policy')
		} finally {
			Reflect.set(compatibility ?? {}, 'operationGroups', operationGroups)
		}
	})

	it('rejects an endpoint kind incompatible with the protocol and API family', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			endpoints: [{
				endpointKind: SourceEndpointKind.LocalProcess,
				locator: 'local:blockscout',
			}],
			delivery: SourceDelivery.LocalOnly,
		})).toThrow('endpoint kind is incompatible with HttpRest/BlockscoutRestV2')
	})

	it('accepts GrpcService over a TCP endpoint', () => {
		const binding = {
			...validBinding,
			endpoints: [{
				endpointKind: SourceEndpointKind.TcpAddress,
				locator: 'mainnet-public.mirrornode.hedera.com:443',
			}],
			wireProtocol: WireProtocol.Grpc,
			apiFamily: ApiFamily.GrpcService,
			delivery: SourceDelivery.RemoteQuery,
		} as const satisfies SourceBinding

		expect(validateSourceBinding(binding)).toBe(binding)
	})

	it('rejects GrpcService over a WebSocket endpoint', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			endpoints: [{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://example.test/grpc',
			}],
			wireProtocol: WireProtocol.Grpc,
			apiFamily: ApiFamily.GrpcService,
			delivery: SourceDelivery.RemoteQuery,
		})).toThrow('endpoint kind is incompatible with Grpc/GrpcService')
	})

	it('rejects an operation group incompatible with a constrained API family', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.EvmExecutionJsonRpc,
			operationGroups: [
				SourceOperationGroup.GenericRead,
			],
		})).toThrow('operation group is incompatible with EvmExecutionJsonRpc')
	})

	it('rejects an artifact kind incompatible with a constrained API family', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			apiFamily: ApiFamily.OpenApiHttp,
			artifacts: [{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'schema.graphql',
				generated: false,
			}],
		})).toThrow('artifact kind is incompatible with OpenApiHttp')
	})

	it('rejects CORS metadata on non-HTTP endpoints', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.EvmExecutionJsonRpc,
			operationGroups: [
				SourceOperationGroup.EvmRpcCore,
			],
			endpoints: [
				{
					endpointKind: SourceEndpointKind.WebSocketUrl,
					locator: 'wss://ethereum.publicnode.com',
					corsEnabled: true,
				},
			],
			delivery: SourceDelivery.RemoteLive,
		})).toThrow('corsEnabled is only valid on HTTP endpoints')
	})

	it('rejects vague endpoint placeholders', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'configured-url',
					origin: 'configured-url',
					corsEnabled: false,
				},
			],
		})).toThrow('endpoint locators must be concrete, env:, or browser:')
	})

	it('rejects HTTP proxy delivery for non-HTTP endpoints', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.EvmExecutionJsonRpc,
			operationGroups: [
				SourceOperationGroup.EvmRpcCore,
			],
			endpoints: [
				{
					endpointKind: SourceEndpointKind.WebSocketUrl,
					locator: 'wss://ethereum.publicnode.com',
				},
			],
		})).toThrow('HttpProxy requires HTTP endpoints')
	})

	it('rejects HTTP proxy delivery for templated origins', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://{origin}/.well-known/agent.json',
					origin: 'https://{origin}',
					corsEnabled: false,
				},
			],
		})).toThrow('HttpProxy requires concrete HTTP origins')
	})

	it('rejects remote live bindings without WebSocket endpoints', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			delivery: SourceDelivery.RemoteLive,
		})).toThrow('RemoteLive requires WebSocket endpoints with at most one leading HTTP endpoint')
	})

	it('rejects RemoteLive endpoints outside the declared sequence', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.EvmExecutionJsonRpc,
			operationGroups: [
				SourceOperationGroup.EvmRpcCore,
			],
			endpoints: [
				{
					endpointKind: SourceEndpointKind.WebSocketUrl,
					locator: 'wss://ethereum.publicnode.com',
				},
				validBinding.endpoints[0],
			],
			delivery: SourceDelivery.RemoteLive,
		})).toThrow('RemoteLive requires WebSocket endpoints with at most one leading HTTP endpoint')
	})

	it('accepts managed gRPC RemoteLive over an HTTP endpoint', () => {
		const binding = {
			...validBinding,
			wireProtocol: WireProtocol.Grpc,
			apiFamily: ApiFamily.GrpcService,
			delivery: SourceDelivery.RemoteLive,
			credentials: [{
				scope: SourceCredentialScope.RuntimeSecret,
			}],
			serverCredentialId: 'grpc-live-fixture',
		} as const satisfies SourceBinding

		expect(validateSourceBinding(binding)).toBe(binding)
	})

	it('rejects server-mediated runtime secrets without an opaque credential id', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			wireProtocol: WireProtocol.Grpc,
			apiFamily: ApiFamily.GrpcService,
			delivery: SourceDelivery.RemoteLive,
			credentials: [{
				scope: SourceCredentialScope.RuntimeSecret,
			}],
		})).toThrow('server-mediated runtime secret requires an opaque server credential id')
	})

	it('rejects orphaned server credential ids', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			serverCredentialId: 'orphaned-credential',
		})).toThrow('server credential id requires a server-mediated runtime secret')
	})

	it('rejects mismatched managed gRPC RemoteLive axes', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			wireProtocol: WireProtocol.Grpc,
			apiFamily: ApiFamily.GrpcService,
			endpoints: [
				validBinding.endpoints[0],
				{
					endpointKind: SourceEndpointKind.TcpAddress,
					locator: 'mainnet-public.mirrornode.hedera.com:443',
				},
			],
			delivery: SourceDelivery.RemoteLive,
		})).toThrow('managed RemoteLive gRPC requires GrpcService over HTTP endpoints')
	})

	it('rejects browser delivery with runtime secrets', () => {
		expect(() => validateSourceBinding({
			...validBinding,
			delivery: SourceDelivery.BrowserDirect,
			endpoints: [{
				...validBinding.endpoints[0],
				corsEnabled: true,
			}],
			credentials: [
				{
					scope: SourceCredentialScope.RuntimeSecret,
				},
			],
		})).toThrow('browser delivery cannot require runtime/local secrets')
	})
})

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
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		try {
			await sourceFetch({
				...validBinding,
				proxyId: 'blockscout-rest-fixture',
				endpoints: [{
					...validBinding.endpoints[0],
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
