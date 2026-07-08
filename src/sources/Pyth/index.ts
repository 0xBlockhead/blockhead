import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { pythBindings } from '$/sources/Pyth/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const pythOrigins = sourceOriginsFromBindings(pythBindings)

const pythSourceProviderDefinition = {
	provider: SourceProvider.Pyth,
	label: 'Pyth',
	sources: [
		{
			provider: SourceProvider.Pyth,
			source: Source.Pyth_EvmContract,
			label: 'Pyth EVM contract catalog',
		},
		{
			provider: SourceProvider.Pyth,
			source: Source.Pyth_SolanaProgram,
			label: 'Pyth Solana program catalog',
		},
		{
			provider: SourceProvider.Pyth,
			source: Source.PythHermes_Rest,
			label: 'Pyth Hermes REST',
		},
		{
			provider: SourceProvider.Pyth,
			source: Source.PythBenchmarks_Rest,
			label: 'Pyth benchmarks REST',
		},
		{
			provider: SourceProvider.Pyth,
			source: Source.PythPriceFeedsCatalog_Rest,
			label: 'Pyth price feeds catalog REST',
		},
	],
	bindings: pythBindings,
	origins: pythOrigins,
} satisfies SourceProviderDefinition

export default pythSourceProviderDefinition
