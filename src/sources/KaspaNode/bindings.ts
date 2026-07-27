// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.KaspaNode_Grpc]: {
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
	[Source.KaspaNode_Rest]: {
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
	[Source.KaspaNode_Wrpc]: {
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
} as const satisfies SourceBindingIndex
