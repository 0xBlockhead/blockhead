import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { circleCctpBindings } from '$/sources/CircleCctp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const circleCctpOrigins = sourceOriginsFromBindings(circleCctpBindings)

const circleCctpSourceProviderDefinition = {
	provider: SourceProvider.CircleCctp,
	label: 'Circle CCTP',
	sources: [
		{
			provider: SourceProvider.CircleCctp,
			source: Source.CircleCctp_IrisApi,
			label: 'Circle CCTP Iris API',
		},
		{
			provider: SourceProvider.CircleCctp,
			source: Source.CircleCctpContracts_Evm,
			label: 'Circle CCTP EVM contracts',
		},
		{
			provider: SourceProvider.CircleCctp,
			source: Source.CircleCctpContracts_Solana,
			label: 'Circle CCTP Solana contracts',
		},
		{
			provider: SourceProvider.CircleCctp,
			source: Source.CircleCctpContracts_Stellar,
			label: 'Circle CCTP Stellar contracts',
		},
	],
	bindings: circleCctpBindings,
	origins: circleCctpOrigins,
} satisfies SourceProviderDefinition

export default circleCctpSourceProviderDefinition
