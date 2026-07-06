// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const availJsonRpcSourceDefinition = {
	provider: SourceProvider.Avail,
	source: Source.Avail_JsonRpc,
	label: 'Avail JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default availJsonRpcSourceDefinition
