// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.GetBlockRpc_JsonRpc]: {
		source: Source.GetBlockRpc_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://go.getblock.io/{GETBLOCK_API_KEY}/',
				origin: 'https://go.getblock.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: [
			SourceOperationGroup.EvmRpcCore,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		proxyId: '["GetBlockRpc_JsonRpc","Eip155Chain","1","HttpProxy","EvmExecutionJsonRpc"]',
		serverCredentialId: '["GetBlockRpc_JsonRpc","Eip155Chain","1","HttpProxy","EvmExecutionJsonRpc"]',
		artifacts: [
			{
				kind: SourceArtifactKind.OpenRpcSpec,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
				generated: false,
			},
		],
	},
	[Source.GetBlockYellowstone_Grpc]: {
		source: Source.GetBlockYellowstone_Grpc,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://go.getblock.io/{GETBLOCK_API_KEY}/',
				origin: 'https://go.getblock.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Grpc,
		apiFamily: ApiFamily.GrpcService,
		operationGroups: [
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		serverCredentialId: '["GetBlockYellowstone_Grpc","Caip2Network","solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp","RemoteLive","GrpcService"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/GetBlock/Yellowstone/types.ts',
				generated: false,
				referenceUrl: 'https://getblock.io/docs/yellowstone-grpc/',
			},
		],
	},
} as const satisfies SourceBindingIndex
