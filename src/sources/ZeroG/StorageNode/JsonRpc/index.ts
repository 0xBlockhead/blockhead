// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const zeroGStorageNodeJsonRpcSourceDefinition = {
	provider: SourceProvider.ZeroG,
	source: Source.ZeroGStorageNode_JsonRpc,
	label: '0G Storage node JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default zeroGStorageNodeJsonRpcSourceDefinition
