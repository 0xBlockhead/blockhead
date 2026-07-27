// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'
import bindings from '$/sources/ZeroG/bindings.ts'

export default {
	provider: SourceProvider.ZeroG,
	label: '0G',
	sources: [
		{
			source: Source.ZeroGChain_JsonRpc,
			label: '0G Chain JSON-RPC',
		},
		{
			source: Source.ZeroGStorageNode_JsonRpc,
			label: '0G Storage node JSON-RPC',
		},
		{
			source: Source.ZeroGChainScan_Rest,
			label: '0G ChainScan REST',
		},
		{
			source: Source.ZeroGStorageScan_Rest,
			label: '0G StorageScan REST',
		},
	],
	bindings: [
		bindings[Source.ZeroGChain_JsonRpc],
		bindings[Source.ZeroGStorageNode_JsonRpc],
		bindings[Source.ZeroGChainScan_Rest],
		bindings[Source.ZeroGStorageScan_Rest],
	],
} satisfies SourceProviderDefinition
