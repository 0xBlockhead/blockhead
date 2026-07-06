// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const lotusJsonRpcSourceDefinition = {
	provider: SourceProvider.Lotus,
	source: Source.Lotus_JsonRpc,
	label: 'Lotus JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default lotusJsonRpcSourceDefinition
