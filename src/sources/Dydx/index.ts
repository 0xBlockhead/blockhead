import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { dydxBindings } from '$/sources/Dydx/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const dydxOrigins = sourceOriginsFromBindings(dydxBindings)

const dydxSourceProviderDefinition = {
	provider: SourceProvider.Dydx,
	label: 'dYdX',
	sources: [
		{
			provider: SourceProvider.Dydx,
			source: Source.DydxIndexer_Rest,
			label: 'dYdX Indexer REST',
		},
		{
			provider: SourceProvider.Dydx,
			source: Source.DydxValidator_Rest,
			label: 'dYdX Validator REST',
		},
	],
	bindings: dydxBindings,
	origins: dydxOrigins,
} satisfies SourceProviderDefinition

export default dydxSourceProviderDefinition
