// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const zebraJsonRpcSourceDefinition = {
	provider: SourceProvider.Zebra,
	source: Source.Zebra_JsonRpc,
	label: 'Zebra JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default zebraJsonRpcSourceDefinition
