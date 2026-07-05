import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Bittensor,
	source: Source.Bittensor_JsonRpc,
	label: 'Bittensor JSON-RPC',
} as const
