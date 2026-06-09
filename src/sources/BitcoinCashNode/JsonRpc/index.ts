import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.BitcoinCashNode,
	source: Source.BitcoinCashNode_JsonRpc,
	label: 'Bitcoin Cash Node JSON-RPC',
} as const
