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

const tonCenterCredentials = [
	{
		scope: SourceCredentialScope.RuntimeSecret,
	},
] as const

export default indexSourceBindings([
	{
		source: Source.TonCenter,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'ton:-239',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://toncenter.com/api/v2/',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: tonCenterCredentials,
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/TonCenter/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/TonCenter/OpenApi/openapi.json',
				generated: true,
				officialUrl: 'https://toncenter.com/api/v2/openapi.json',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/TonCenter/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
	{
		source: Source.TonCenter,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'ton:-3',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://testnet.toncenter.com/api/v2/',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: tonCenterCredentials,
	},
	{
		source: Source.TonCenter,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'ton:-239',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://toncenter.com/api/v3/',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.TonCenterV3Api,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/TonCenter/V3/Rest/types.ts',
			},
		],
	},
] as const satisfies readonly SourceBinding[])
