// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const moneroDaemonRpcJsonRpcSourceDefinition = {
	provider: SourceProvider.MoneroDaemonRpc,
	source: Source.MoneroDaemonRpc_JsonRpc,
	label: 'Monero daemon JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default moneroDaemonRpcJsonRpcSourceDefinition
