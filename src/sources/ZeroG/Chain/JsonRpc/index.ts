// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const zeroGChainJsonRpcSourceDefinition = {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGChain_JsonRpc,
	label: '0G Chain JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default zeroGChainJsonRpcSourceDefinition
