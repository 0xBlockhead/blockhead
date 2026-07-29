// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.AptosFullnode_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'aptos:1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://fullnode.mainnet.aptoslabs.com/v1/',
				origin: 'https://fullnode.mainnet.aptoslabs.com',
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
				path: 'src/sources/AptosFullnode/OpenApi/spec.yaml',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/AptosFullnode/OpenApi/schema-source.ts',
				generated: false,
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/AptosFullnode/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.AptosFullnode_Rest]: typeof bindings[0] }>(bindings)
