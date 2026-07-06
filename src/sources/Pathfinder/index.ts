// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const pathfinderJsonRpcSourceDefinition = {
	provider: SourceProvider.Pathfinder,
	source: Source.Pathfinder_JsonRpc,
	label: 'Pathfinder JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default pathfinderJsonRpcSourceDefinition
