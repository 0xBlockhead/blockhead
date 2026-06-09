import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import ZeroGChainJsonRpc from '$/sources/ZeroG/Chain/JsonRpc/index.ts'
import ZeroGChainScanRest from '$/sources/ZeroG/ChainScan/Rest/index.ts'
import ZeroGStorageNodeJsonRpc from '$/sources/ZeroG/StorageNode/JsonRpc/index.ts'
import ZeroGStorageScanRest from '$/sources/ZeroG/StorageScan/Rest/index.ts'

export default {
	provider: SourceProvider.ZeroG,
	label: '0G',
	origins: [
		{
			origin: 'https://docs.0g.ai',
			corsEnabled: true,
		},
		{
			origin: 'https://chainscan.0g.ai',
			corsEnabled: true,
		},
		{
			origin: 'https://storagescan.0g.ai',
			corsEnabled: true,
		},
		{
			origin: 'https://evmrpc.0g.ai',
			corsEnabled: false,
		},
	],
	sources: [
		{
			provider: SourceProvider.ZeroG,
			source: Source.ZeroGDocs_Rest,
			label: '0G docs',
		},
		ZeroGChainJsonRpc,
		ZeroGStorageNodeJsonRpc,
		{
			provider: SourceProvider.ZeroG,
			source: Source.ZeroGDaNode_Grpc,
			label: '0G DA node gRPC',
		},
		ZeroGChainScanRest,
		ZeroGStorageScanRest,
	],
} as const satisfies SourceProviderDefinition
