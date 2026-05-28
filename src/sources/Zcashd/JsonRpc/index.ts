import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.Zcashd,
	source: Source.Zcashd_JsonRpc,
	label: 'zcashd JSON-RPC',
} as const
