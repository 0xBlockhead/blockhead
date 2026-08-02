// Generated from APP.ts.

import bindings from '$/sources/Pyth/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Pyth,
	label: 'Pyth',
	sources: {
		[Source.Pyth_EvmContract]: {
			label: 'Pyth EVM contract catalog',
		},
		[Source.Pyth_SolanaProgram]: {
			label: 'Pyth Solana program catalog',
		},
		[Source.PythBenchmarks_Rest]: {
			label: 'Pyth benchmarks REST',
		},
		[Source.PythHermes_Rest]: {
			label: 'Pyth Hermes REST',
		},
	},
	bindings,
} satisfies SourceProviderDefinition<typeof bindings>
