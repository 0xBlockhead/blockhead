import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import ZeroGChainJsonRpc, { zeroGMainnetRpcEndpoints } from '$/sources/ZeroG/Chain/JsonRpc/index.ts'
import ZeroGChainScanRest, { zeroGMainnetExplorerEndpoints } from '$/sources/ZeroG/ChainScan/Rest/index.ts'
import ZeroGStorageNodeJsonRpc, { zeroGStorageNodeRpcEndpoints } from '$/sources/ZeroG/StorageNode/JsonRpc/index.ts'
import ZeroGStorageScanRest, { zeroGMainnetStorageEndpoints } from '$/sources/ZeroG/StorageScan/Rest/index.ts'

export default {
	provider: SourceProvider.ZeroG,
	label: '0G',
	origins: [
		...zeroGMainnetExplorerEndpoints.map((endpoint) => ({
			origin: new URL(endpoint.url).origin,
			corsEnabled: true,
		})),
		...zeroGMainnetStorageEndpoints.map((endpoint) => ({
			origin: new URL(endpoint.url).origin,
			corsEnabled: true,
		})),
		...zeroGMainnetRpcEndpoints.map((endpoint) => ({
			origin: new URL(endpoint.url).origin,
			corsEnabled: false,
		})),
		...zeroGStorageNodeRpcEndpoints.map((endpoint) => ({
			origin: new URL(endpoint.url).origin,
			corsEnabled: true,
		})),
	],
	sources: [
		ZeroGChainJsonRpc,
		ZeroGStorageNodeJsonRpc,
		ZeroGChainScanRest,
		ZeroGStorageScanRest,
	],
} as const satisfies SourceProviderDefinition
