// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Pyth/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

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
		{
			source: Source.PythPriceFeedsCatalog_Rest,
			label: 'Pyth price feeds catalog REST',
		},
	],
	bindings: [
		bindings[Source.Pyth_EvmContract],
		bindings[Source.Pyth_SolanaProgram],
		bindings[Source.PythHermes_Rest],
		bindings[Source.PythBenchmarks_Rest],
		bindings[Source.PythPriceFeedsCatalog_Rest],
	],
} satisfies SourceProviderDefinition
