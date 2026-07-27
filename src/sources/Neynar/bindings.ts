// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default {
	[Source.Neynar_Rest]: {
		source: Source.Neynar_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.neynar.com',
				origin: 'https://api.neynar.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_NEYNAR_API_KEY': 'string > 0?',
				}),
				keys: [
					'PUBLIC_NEYNAR_API_KEY',
				],
			},
		],
		proxyId: '["Neynar_Rest","Global","api","HttpProxy","OpenApiHttp"]',
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Neynar/OpenApi/openapi.yaml',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Neynar/OpenApi/schema-source.ts',
				generated: false,
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Neynar/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
} as const satisfies SourceBindingIndex
