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

export default indexSourceBindings([
	{
		source: Source.Blockfrost_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'cip34:1-764824073',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://cardano-mainnet.blockfrost.io/api/v0/',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Blockfrost/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Blockfrost/OpenApi/openapi.yaml',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Blockfrost/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[])
