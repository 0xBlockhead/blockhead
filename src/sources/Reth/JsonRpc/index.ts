// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const rethJsonRpcSourceDefinition = {
	provider: SourceProvider.Reth,
	source: Source.Reth_JsonRpc,
	label: 'Reth JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default rethJsonRpcSourceDefinition
