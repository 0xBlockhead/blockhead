import {
	statSync,
} from 'node:fs'

import {
	beforeAll,
	describe,
	expect,
	it,
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
import { auditSourceProviders } from '$/sources/auditSourceProviders.ts'
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
let browserSourceBindings: readonly SourceBinding[]
let remoteLiveBindings: readonly SourceBinding[]
let httpProxyOrigins: Set<string>

beforeAll(() => {
	sourceProviders = [...generatedSourceProviders]
	sourceBindings = validateSourceBindings(sourceProviders.flatMap((provider) => provider.bindings))
	browserSourceBindings = validateSourceBindings(
		sourceBindings.filter((binding) => (
			(
				binding.delivery === SourceDelivery.BrowserDirect
				|| binding.delivery === SourceDelivery.HttpProxy
				|| binding.delivery === SourceDelivery.RemoteQuery
				|| binding.delivery === SourceDelivery.RemoteLive
			)
			&& binding.credentials.every((credential) => (
				credential.scope === SourceCredentialScope.None
				|| credential.scope === SourceCredentialScope.PublicConfig
				|| credential.scope === SourceCredentialScope.UserDelegated
			))
		))
	)
	remoteLiveBindings = sourceBindings.filter((binding) => binding.delivery === SourceDelivery.RemoteLive)
	httpProxyOrigins = new Set(
		sourceBindings
			.filter((binding) => binding.delivery === SourceDelivery.HttpProxy)
			.flatMap((binding) => (
				binding.endpoints
					.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)
					.map((endpoint) => endpoint.origin ?? endpoint.locator)
			))
	)
})

const sourceMember = (
	name: string
) => (Source as Record<string, Source | undefined>)[name]

describe('SourceBinding validation', () => {
	it('accepts a valid HTTP proxy binding', () => {
		expect(validateSourceBinding(validBinding)).toBe(validBinding)
	})

	it('rejects CORS metadata on non-HTTP endpoints', () => {
		expect(() => validateSourceBinding({
			...validBinding,
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
		})).toThrow('RemoteLive requires a WebSocket endpoint')
	})

	it('rejects browser delivery with runtime secrets', () => {
		expect(() => validateSourceBinding({
			...validBinding,
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
		expect(httpProxyOrigins.has('https://eth.blockscout.com')).toBe(true)
		if (sourceMember('Ipfs_Rest') !== undefined)
			expect(httpProxyOrigins.has('https://ipfs.io')).toBe(true)
	})

	it('keeps RemoteLive WebSocket bindings out of the HTTP proxy origins', () => {
		expect(remoteLiveBindings.some((binding) => (
			binding.source === Source.Voltaire_JsonRpc
			&& binding.delivery === SourceDelivery.RemoteLive
		))).toBe(true)
		expect(httpProxyOrigins.has('wss://ethereum.publicnode.com')).toBe(false)
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
})
