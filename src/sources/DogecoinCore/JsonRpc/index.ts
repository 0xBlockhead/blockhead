// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const dogecoinCoreJsonRpcSourceDefinition = {
	provider: SourceProvider.DogecoinCore,
	source: Source.DogecoinCore_JsonRpc,
	label: 'Dogecoin Core JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default dogecoinCoreJsonRpcSourceDefinition
