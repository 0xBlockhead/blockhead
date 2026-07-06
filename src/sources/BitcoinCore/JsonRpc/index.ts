// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bitcoinCoreJsonRpcSourceDefinition = {
	provider: SourceProvider.BitcoinCore,
	source: Source.BitcoinCore_JsonRpc,
	label: 'Bitcoin Core JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bitcoinCoreJsonRpcSourceDefinition
