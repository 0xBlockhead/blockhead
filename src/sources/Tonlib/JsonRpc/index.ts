// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tonlibJsonRpcSourceDefinition = {
	provider: SourceProvider.Tonlib,
	source: Source.Tonlib_JsonRpc,
	label: 'tonlib JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tonlibJsonRpcSourceDefinition
