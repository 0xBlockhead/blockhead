// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
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
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Blockfrost/OpenApi/openapi.yaml',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Blockfrost/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Blockfrost/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
