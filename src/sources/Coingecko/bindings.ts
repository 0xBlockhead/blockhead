// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

const coingeckoOpenApiGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const coingeckoOpenApiArtifacts = [
	{
		kind: SourceArtifactKind.OpenApiSpec,
		path: 'src/sources/Coingecko/OpenApi/coingecko-demo.json',
		generated: false,
	},
	{
		kind: SourceArtifactKind.GenerationManifest,
		path: 'src/sources/Coingecko/OpenApi/schema-source.ts',
		generated: false,
	},
	{
		kind: SourceArtifactKind.OpenApiTypes,
		path: 'src/sources/Coingecko/OpenApi/openapi.d.ts',
		generated: true,
	},
] as const

const coingeckoRestGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const
const coingeckoRestArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/Coingecko/Rest/types.ts',
		generated: false,
	},
] as const

export default {
	[Source.Coingecko_OpenApi]: [
		{
			source: Source.Coingecko_OpenApi,
			target: {
				kind: SourceTargetKind.Global,
				key: 'coingecko-demo',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.coingecko.com/api/v3',
					origin: 'https://api.coingecko.com',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.OpenApiHttp,
			operationGroups: coingeckoOpenApiGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: [
				{
					scope: SourceCredentialScope.PublicConfig,
					env: arktype({
						'PUBLIC_COINGECKO_DEMO_API_KEY': 'string',
					}),
					keys: [
						'PUBLIC_COINGECKO_DEMO_API_KEY',
					],
				},
			],
			proxyId: '["Coingecko_OpenApi","Global","coingecko-demo","HttpProxy","OpenApiHttp"]',
			artifacts: coingeckoOpenApiArtifacts,
		},
		{
			source: Source.Coingecko_OpenApi,
			target: {
				kind: SourceTargetKind.Global,
				key: 'coingecko-pro',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://pro-api.coingecko.com/api/v3',
					origin: 'https://pro-api.coingecko.com',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.OpenApiHttp,
			operationGroups: coingeckoOpenApiGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: [
				{
					scope: SourceCredentialScope.PublicConfig,
					env: arktype({
						'PUBLIC_COINGECKO_PRO_API_KEY': 'string',
					}),
					keys: [
						'PUBLIC_COINGECKO_PRO_API_KEY',
					],
				},
			],
			proxyId: '["Coingecko_OpenApi","Global","coingecko-pro","HttpProxy","OpenApiHttp"]',
			artifacts: coingeckoOpenApiArtifacts,
		},
	],
	[Source.Coingecko_Rest]: [
		{
			source: Source.Coingecko_Rest,
			target: {
				kind: SourceTargetKind.Global,
				key: 'coingecko-demo',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://api.coingecko.com/api/v3',
					origin: 'https://api.coingecko.com',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: coingeckoRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: [
				{
					scope: SourceCredentialScope.PublicConfig,
					env: arktype({
						'PUBLIC_COINGECKO_DEMO_API_KEY': 'string',
					}),
					keys: [
						'PUBLIC_COINGECKO_DEMO_API_KEY',
					],
				},
			],
			proxyId: '["Coingecko_Rest","Global","coingecko-demo","HttpProxy","RestJson"]',
			artifacts: coingeckoRestArtifacts,
		},
		{
			source: Source.Coingecko_Rest,
			target: {
				kind: SourceTargetKind.Global,
				key: 'coingecko-pro',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://pro-api.coingecko.com/api/v3',
					origin: 'https://pro-api.coingecko.com',
					corsEnabled: false,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RestJson,
			operationGroups: coingeckoRestGenericReadOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: [
				{
					scope: SourceCredentialScope.PublicConfig,
					env: arktype({
						'PUBLIC_COINGECKO_PRO_API_KEY': 'string',
					}),
					keys: [
						'PUBLIC_COINGECKO_PRO_API_KEY',
					],
				},
			],
			proxyId: '["Coingecko_Rest","Global","coingecko-pro","HttpProxy","RestJson"]',
			artifacts: coingeckoRestArtifacts,
		},
	],
} as const satisfies SourceBindingIndex
