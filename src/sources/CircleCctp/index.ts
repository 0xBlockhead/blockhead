import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { circleCctpBindings } from '$/sources/CircleCctp/bindings.ts'

export default {
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
			label: 'Circle CCTP EVM contract catalog',
		},
		{
			provider: SourceProvider.CircleCctp,
			source: Source.CircleCctpContracts_Solana,
			label: 'Circle CCTP Solana program catalog',
		},
		{
			provider: SourceProvider.CircleCctp,
			source: Source.CircleCctpContracts_Stellar,
			label: 'Circle CCTP Stellar contract catalog',
		},
	],
	bindings: circleCctpBindings,
} satisfies SourceProviderDefinition
