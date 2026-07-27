// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CircleCctp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.CircleCctp,
	label: 'Circle CCTP',
	sources: [
		{
			source: Source.CircleCctp_IrisApi,
			label: 'Circle CCTP Iris API',
		},
		{
			source: Source.CircleCctpContracts_Evm,
			label: 'Circle CCTP EVM contracts',
		},
		{
			source: Source.CircleCctpContracts_Solana,
			label: 'Circle CCTP Solana contracts',
		},
		{
			source: Source.CircleCctpContracts_Stellar,
			label: 'Circle CCTP Stellar contracts',
		},
	],
	bindings: [
		bindings[Source.CircleCctp_IrisApi],
		bindings[Source.CircleCctpContracts_Evm],
		bindings[Source.CircleCctpContracts_Solana],
		bindings[Source.CircleCctpContracts_Stellar],
	],
} satisfies SourceProviderDefinition
