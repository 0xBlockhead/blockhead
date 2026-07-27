// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.ZeroGChain_JsonRpc]: {
		source: Source.ZeroGChain_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '16661',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://evmrpc.0g.ai',
				origin: 'https://evmrpc.0g.ai',
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
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["ZeroGChain_JsonRpc","Eip155Chain","16661","HttpProxy","EvmExecutionJsonRpc"]',
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
	[Source.ZeroGStorageNode_JsonRpc]: {
		source: Source.ZeroGStorageNode_JsonRpc,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'local-0g-storage-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://127.0.0.1:5678',
				origin: 'http://127.0.0.1:5678',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.JsonRpcApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/ZeroG/StorageNode/JsonRpc/types.ts',
				generated: false,
			},
		],
	},
	[Source.ZeroGChainScan_Rest]: {
		source: Source.ZeroGChainScan_Rest,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '16661',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://chainscan.0g.ai',
				origin: 'https://chainscan.0g.ai',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/ZeroG/ChainScan/Rest/types.ts',
				generated: false,
			},
		],
	},
	[Source.ZeroGStorageScan_Rest]: {
		source: Source.ZeroGStorageScan_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: '0g-storage-scan',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://storagescan.0g.ai',
				origin: 'https://storagescan.0g.ai',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/ZeroG/StorageScan/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex
