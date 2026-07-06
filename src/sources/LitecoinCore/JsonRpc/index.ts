// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const litecoinCoreJsonRpcSourceDefinition = {
	provider: SourceProvider.LitecoinCore,
	source: Source.LitecoinCore_JsonRpc,
	label: 'Litecoin Core JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default litecoinCoreJsonRpcSourceDefinition
