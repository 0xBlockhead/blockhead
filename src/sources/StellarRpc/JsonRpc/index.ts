// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const stellarRpcJsonRpcSourceDefinition = {
	provider: SourceProvider.StellarRpc,
	source: Source.StellarRpc_JsonRpc,
	label: 'Stellar RPC JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default stellarRpcJsonRpcSourceDefinition
