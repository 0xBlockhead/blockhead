// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const starknetJsonRpcSourceDefinition = {
	provider: SourceProvider.Starknet,
	source: Source.Starknet_JsonRpc,
	label: 'Starknet JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default starknetJsonRpcSourceDefinition
