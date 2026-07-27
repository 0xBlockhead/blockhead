// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Blockfrost_Rest]: {
		source: Source.Blockfrost_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'cip34:1-764824073',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://cardano-mainnet.blockfrost.io/api/v0/',
				origin: 'https://cardano-mainnet.blockfrost.io',
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
		proxyId: '["Blockfrost_Rest","Caip2Network","cip34:1-764824073","HttpProxy","OpenApiHttp"]',
		serverCredentialId: '["Blockfrost_Rest","Caip2Network","cip34:1-764824073","HttpProxy","OpenApiHttp"]',
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Blockfrost/OpenApi/openapi.yaml',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Blockfrost/OpenApi/schema-source.ts',
				generated: false,
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Blockfrost/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
} as const satisfies SourceBindingIndex
