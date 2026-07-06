// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const litecoinWalletRpcJsonRpcSourceDefinition = {
	provider: SourceProvider.LitecoinWalletRpc,
	source: Source.LitecoinWalletRpc_JsonRpc,
	label: 'Litecoin wallet JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default litecoinWalletRpcJsonRpcSourceDefinition
