import { type as arktype } from 'arktype'

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
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
import {
	coinsBaseUrl,
	coinsOrigin,
	iconsOrigin,
	proBaseUrl,
	proOrigin,
} from '$/sources/Defillama/Rest/constants.ts'

export const defillamaPublicEnv = arktype({
	PUBLIC_DEFILLAMA_PRO_API_KEY: 'string > 0?',
})

const defillamaPublicCredentials = [
	{
		scope: SourceCredentialScope.PublicConfig,
		keys: [
			'PUBLIC_DEFILLAMA_PRO_API_KEY',
		],
	},
] as const

export const defillamaBindings: readonly SourceBinding[] = [
	{
		provider: SourceProvider.Defillama,
		source: Source.Defillama_OpenApi,
		target: {
			kind: SourceTargetKind.Global,
			key: 'coins-openapi',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: coinsBaseUrl,
				origin: coinsOrigin,
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: iconsOrigin,
				origin: iconsOrigin,
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
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Defillama/OpenApi/openapi.json',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Defillama/OpenApi/schema-source.ts',
				generated: false,
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Defillama/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
	{
		provider: SourceProvider.Defillama,
		source: Source.Defillama_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'coins-pro-rest',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: proBaseUrl,
				origin: proOrigin,
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: defillamaPublicCredentials,
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Defillama/Rest/types.ts',
				generated: false,
			},
		],
	},
] satisfies readonly SourceBinding[]
