// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const bitcoinCashNodeJsonRpcSourceDefinition = {
	provider: SourceProvider.BitcoinCashNode,
	source: Source.BitcoinCashNode_JsonRpc,
	label: 'Bitcoin Cash Node JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default bitcoinCashNodeJsonRpcSourceDefinition
