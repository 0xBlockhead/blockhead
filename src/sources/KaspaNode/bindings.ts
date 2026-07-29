// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.KaspaNode_Grpc,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'kaspa',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.TcpAddress,
				locator: 'env:KASPA_NODE_GRPC_ENDPOINT',
			},
		],
		wireProtocol: WireProtocol.Grpc,
		apiFamily: ApiFamily.GrpcService,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.Proto,
				path: 'src/sources/KaspaNode/Grpc/proto',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/KaspaNode/Grpc/schema-source.ts',
				generated: false,
			},
		],
	},
	{
		source: Source.KaspaNode_Rest,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'kaspa',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:KASPA_NODE_REST_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.KaspaRestApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		source: Source.KaspaNode_Wrpc,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'kaspa',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:KASPA_NODE_WRPC_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Wrpc,
		apiFamily: ApiFamily.KaspaWrpcApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.KaspaNode_Grpc]: typeof bindings[0]
	readonly [Source.KaspaNode_Rest]: typeof bindings[1]
	readonly [Source.KaspaNode_Wrpc]: typeof bindings[2]
}>(bindings)
