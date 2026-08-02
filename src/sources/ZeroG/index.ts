// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
