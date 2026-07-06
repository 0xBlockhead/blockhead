// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const moneroWalletRpcJsonRpcSourceDefinition = {
	provider: SourceProvider.MoneroWalletRpc,
	source: Source.MoneroWalletRpc_JsonRpc,
	label: 'Monero wallet JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default moneroWalletRpcJsonRpcSourceDefinition
