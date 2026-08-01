// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/CircleCctp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.CircleCctp,
	label: 'Circle CCTP',
	sources: [
		{
			source: Source.CircleCctpIris,
			label: 'Circle CCTP Iris',
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
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
