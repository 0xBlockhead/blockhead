// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const nearRpcJsonRpcSourceDefinition = {
	provider: SourceProvider.NearRpc,
	source: Source.NearRpc_JsonRpc,
	label: 'NEAR JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default nearRpcJsonRpcSourceDefinition
