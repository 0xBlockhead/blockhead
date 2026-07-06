// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const junoJsonRpcSourceDefinition = {
	provider: SourceProvider.Juno,
	source: Source.Juno_JsonRpc,
	label: 'Juno JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default junoJsonRpcSourceDefinition
