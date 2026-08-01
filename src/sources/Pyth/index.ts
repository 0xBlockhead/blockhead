// Generated from APP.ts.

import bindings from '$/sources/Pyth/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Pyth,
	label: 'Pyth',
	sources: [
		{
			source: Source.Pyth_EvmContract,
			label: 'Pyth EVM contract catalog',
		},
		{
			source: Source.Pyth_SolanaProgram,
			label: 'Pyth Solana program catalog',
		},
		{
			source: Source.PythHermes_Rest,
			label: 'Pyth Hermes REST',
		},
		{
			source: Source.PythBenchmarks_Rest,
			label: 'Pyth benchmarks REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition
