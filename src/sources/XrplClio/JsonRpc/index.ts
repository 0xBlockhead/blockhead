// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const xrplClioJsonRpcSourceDefinition = {
	provider: SourceProvider.XrplClio,
	source: Source.XrplClio_JsonRpc,
	label: 'XRPL Clio JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default xrplClioJsonRpcSourceDefinition
