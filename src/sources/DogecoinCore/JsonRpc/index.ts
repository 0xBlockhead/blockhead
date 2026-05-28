import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'

export default {
	provider: SourceProvider.DogecoinCore,
	source: Source.DogecoinCore_JsonRpc,
	label: 'Dogecoin Core JSON-RPC',
} as const
