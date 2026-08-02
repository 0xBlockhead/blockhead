// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/KaspaNode/Grpc/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.Proto,
				path: 'src/sources/KaspaNode/Grpc/proto',
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
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
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
	},
] as const satisfies readonly SourceBinding[])
