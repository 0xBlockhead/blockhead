// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const zeroGGenericReadOperationGroups = [
	SourceOperationGroup.GenericRead,
] as const

const bindings = [
	{
		source: Source.ZeroGChain_JsonRpc,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '16661',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://evmrpc.0g.ai',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.EvmExecutionJsonRpc,
		operationGroups: [
			SourceOperationGroup.EvmRpcCore,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenRpcSpec,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
			},
		],
	},
	{
		source: Source.ZeroGStorageNode_JsonRpc,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'local-0g-storage-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'http://127.0.0.1:5678',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.JsonRpcApi,
		operationGroups: zeroGGenericReadOperationGroups,
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
			},
		],
	},
	{
		source: Source.ZeroGChainScan_Rest,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '16661',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://chainscan.0g.ai',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: zeroGGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/ZeroG/ChainScan/Rest/types.ts',
			},
		],
	},
	{
		source: Source.ZeroGStorageScan_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: '0g-storage-scan',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://storagescan.0g.ai',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: zeroGGenericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/ZeroG/StorageScan/Rest/types.ts',
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)
