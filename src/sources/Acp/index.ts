// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const acpLocalJsonRpcSourceDefinition = {
	provider: SourceProvider.Acp,
	source: Source.AcpLocal_JsonRpc,
	label: 'ACP local JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default acpLocalJsonRpcSourceDefinition
