// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bittensorJsonRpcSourceDefinition = {
	provider: SourceProvider.Bittensor,
	source: Source.Bittensor_JsonRpc,
	label: 'Bittensor JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bittensorJsonRpcSourceDefinition
