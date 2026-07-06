// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const hyperliquidJsonRpcSourceDefinition = {
	provider: SourceProvider.Hyperliquid,
	source: Source.Hyperliquid_JsonRpc,
	label: 'HyperEVM JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default hyperliquidJsonRpcSourceDefinition
