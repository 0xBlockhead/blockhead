// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.EnvioHyperRpc_JsonRpc]: {
		source: Source.EnvioHyperRpc_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://eth.rpc.hypersync.xyz/{ENVIO_API_TOKEN}',
				origin: 'https://eth.rpc.hypersync.xyz',
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
		proxyId: '["EnvioHyperRpc_JsonRpc","Eip155Chain","1","HttpProxy","EvmExecutionJsonRpc"]',
		serverCredentialId: '["EnvioHyperRpc_JsonRpc","Eip155Chain","1","HttpProxy","EvmExecutionJsonRpc"]',
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
	[Source.EnvioHyperSync_RawHttp]: {
		source: Source.EnvioHyperSync_RawHttp,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://eth.hypersync.xyz',
				origin: 'https://eth.hypersync.xyz',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.EnvioHyperSyncApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		proxyId: '["EnvioHyperSync_RawHttp","Eip155Chain","1","HttpProxy","EnvioHyperSyncApi"]',
		serverCredentialId: '["EnvioHyperSync_RawHttp","Eip155Chain","1","HttpProxy","EnvioHyperSyncApi"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Envio/HyperSync/types.ts',
				generated: false,
				referenceUrl: 'https://docs.envio.dev/docs/HyperSync/overview',
			},
		],
	},
} as const satisfies SourceBindingIndex
