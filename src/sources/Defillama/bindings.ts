// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { type as arktype } from 'arktype'

export default indexSourceBindings([
	{
		source: Source.Defillama_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'coins-public',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://coins.llama.fi',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Defillama/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Defillama/OpenApi/openapi.json',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Defillama/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.Defillama_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'chain-icons',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://icons.llama.fi',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.StaticWebsite,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
	},
	{
		source: Source.Defillama_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'coins-pro',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://pro-api.llama.fi',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.PublicConfig,
				env: arktype({
					'PUBLIC_DEFILLAMA_PRO_API_KEY': 'string > 0?',
				}),
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Defillama/OpenApi/Pro/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Defillama/OpenApi/Pro/openapi.json',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Defillama/OpenApi/Pro/openapi.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[])
