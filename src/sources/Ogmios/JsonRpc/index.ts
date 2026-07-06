// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const ogmiosJsonRpcSourceDefinition = {
	provider: SourceProvider.Ogmios,
	source: Source.Ogmios_JsonRpc,
	label: 'Ogmios JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default ogmiosJsonRpcSourceDefinition
