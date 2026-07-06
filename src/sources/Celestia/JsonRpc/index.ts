// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const celestiaJsonRpcSourceDefinition = {
	provider: SourceProvider.Celestia,
	source: Source.Celestia_JsonRpc,
	label: 'Celestia JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default celestiaJsonRpcSourceDefinition
