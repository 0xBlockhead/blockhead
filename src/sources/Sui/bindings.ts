// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Sui_Graphql,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'sui',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{sui-graphql-host}',
				origin: 'https://{sui-graphql-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Sui/Graphql/types.ts',
				generated: false,
			},
		],
	},
	{
		source: Source.Sui_Grpc,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'sui',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.TcpAddress,
				locator: 'env:SUI_GRPC_ENDPOINT',
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
	},
	{
		source: Source.Sui_JsonRpc,
		target: {
			kind: SourceTargetKind.NetworkSlug,
			key: 'sui',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{sui-rpc-host}',
				origin: 'https://{sui-rpc-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.JsonRpcApi,
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
	readonly [Source.Sui_Graphql]: typeof bindings[0]
	readonly [Source.Sui_Grpc]: typeof bindings[1]
	readonly [Source.Sui_JsonRpc]: typeof bindings[2]
}>(bindings)
